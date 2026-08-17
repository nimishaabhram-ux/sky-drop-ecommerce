import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Battery, Wind, Signal, Navigation, Package, Zap } from 'lucide-react';
import { DroneTelemetry, Order } from '../types';
import { ordersApi } from '../services/ordersApi';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

// Fix Leaflet default icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Drone Icon
const droneIcon = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-600 -translate-x-1/2 -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [telemetry, setTelemetry] = useState<DroneTelemetry | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [route, setRoute] = useState<[number, number][]>([]);

  // Fetch Order
  useEffect(() => {
    if (!id) return;
    ordersApi.getOrder(id).then(setOrder).catch(console.error);
  }, [id]);

  // Subscribe to SSE
  useEffect(() => {
    if (!id) return;

    let eventSource: EventSource;

    const connectSSE = () => {
      setConnectionStatus('connecting');
      eventSource = new EventSource(`/api/drone-telemetry/${id}/stream`);

      eventSource.onopen = () => {
        setConnectionStatus('connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data: DroneTelemetry = JSON.parse(event.data);
          setTelemetry(data);
          setRoute(prev => [...prev, [data.latitude, data.longitude]]);
        } catch (err) {
          console.error('Failed to parse telemetry', err);
        }
      };

      eventSource.onerror = () => {
        setConnectionStatus('disconnected');
        eventSource.close();
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [id]);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Fallback coords if no telemetry yet
  const defaultCenter: [number, number] = [37.7749, -122.4194];
  const currentPos: [number, number] = telemetry 
    ? [telemetry.latitude, telemetry.longitude] 
    : order.deliveryLocation 
      ? [order.deliveryLocation.latitude, order.deliveryLocation.longitude] 
      : defaultCenter;

  const getStatusText = (status: string) => status.replace(/_/g, ' ');

  return (
    <div className="h-screen md:h-[calc(100vh-64px)] w-full flex flex-col relative bg-slate-50">
      {/* Header overlay */}
      <div className="absolute top-4 left-4 right-4 z-[400] pointer-events-none flex justify-between items-start">
        <Link to={`/orders/${id}`} className="pointer-events-auto bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-slate-700 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="pointer-events-auto flex gap-2">
          <Badge variant={connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'danger'} className="shadow-sm bg-white/90 backdrop-blur-sm">
            {connectionStatus === 'connected' ? 'Live Telemetry' : connectionStatus === 'connecting' ? 'Connecting...' : 'Connection Lost'}
          </Badge>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 w-full z-0 relative">
        <MapContainer 
          center={currentPos} 
          zoom={15} 
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {/* Destination Marker */}
          {order.deliveryLocation && (
            <Marker position={[order.deliveryLocation.latitude, order.deliveryLocation.longitude]}>
              <Popup>Delivery Location: {order.deliveryLocation.name}</Popup>
            </Marker>
          )}

          {/* Drone Marker */}
          {telemetry && (
            <Marker position={[telemetry.latitude, telemetry.longitude]} icon={droneIcon}>
              <Popup>SkyDrop Drone #{telemetry.droneId}</Popup>
            </Marker>
          )}

          {/* Route History */}
          {route.length > 1 && (
            <Polyline positions={route} color="#2563eb" weight={4} opacity={0.8} />
          )}
        </MapContainer>
      </div>

      {/* Telemetry Dashboard */}
      <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-[400] relative w-full md:w-96 md:absolute md:bottom-8 md:right-8 md:rounded-3xl">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 capitalize mb-1">
              {telemetry ? getStatusText(telemetry.status) : getStatusText(order.status)}
            </h2>
            <p className="text-sm text-slate-500">
              {telemetry?.etaSeconds ? `Arriving in ${Math.ceil(telemetry.etaSeconds / 60)} mins` : 'Calculating ETA...'}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
            <Navigation className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Altitude</p>
              <p className="text-sm font-bold text-slate-900">{telemetry?.altitude ? `${Math.round(telemetry.altitude)}m` : '--'}</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
            <Zap className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Speed</p>
              <p className="text-sm font-bold text-slate-900">{telemetry?.speedKmh ? `${Math.round(telemetry.speedKmh)} km/h` : '--'}</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
            <Battery className={`w-5 h-5 shrink-0 ${telemetry && telemetry.batteryPercent < 20 ? 'text-red-500' : 'text-slate-400'}`} />
            <div>
              <p className="text-xs text-slate-500 font-medium">Battery</p>
              <p className="text-sm font-bold text-slate-900">{telemetry?.batteryPercent ? `${Math.round(telemetry.batteryPercent)}%` : '--'}</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
            <Wind className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Wind</p>
              <p className="text-sm font-bold text-slate-900">{telemetry?.windSpeedKmh ? `${Math.round(telemetry.windSpeedKmh)} km/h` : '--'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
