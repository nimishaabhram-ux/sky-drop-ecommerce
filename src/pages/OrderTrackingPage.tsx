import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Battery, Wind, Navigation, Package, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { DroneTelemetry, Order } from '../types';
import { ordersApi } from '../services/ordersApi';

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
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    if (!id) return;
    ordersApi.getOrder(id).then(setOrder).catch(console.error);
  }, [id]);

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
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const defaultCenter: [number, number] = [37.7749, -122.4194];
  const currentPos: [number, number] = telemetry 
    ? [telemetry.latitude, telemetry.longitude] 
    : order.deliveryLocation 
      ? [order.deliveryLocation.latitude, order.deliveryLocation.longitude] 
      : defaultCenter;

  const getStatusText = (status: string) => status.replace(/_/g, ' ');

  return (
    <div className="h-screen md:h-[calc(100vh-64px)] w-full flex flex-col relative bg-white">
      {/* Header overlay */}
      <div className="absolute top-4 left-4 right-4 z-[400] pointer-events-none flex justify-between items-start">
        <Link to={`/orders/${id}`} className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-full shadow-sm border border-gray-100 text-gray-700 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="pointer-events-auto flex gap-2">
          <span className={`shadow-sm bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
            connectionStatus === 'connected' ? 'text-green-600 border-green-100' : 
            connectionStatus === 'connecting' ? 'text-yellow-600 border-yellow-100' : 'text-red-600 border-red-100'
          }`}>
            {connectionStatus === 'connected' ? 'Live GPS' : connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
          </span>
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
          
          {order.deliveryLocation && (
            <Marker position={[order.deliveryLocation.latitude, order.deliveryLocation.longitude]}>
              <Popup>Delivery Location: {order.deliveryLocation.name}</Popup>
            </Marker>
          )}

          {telemetry && (
            <Marker position={[telemetry.latitude, telemetry.longitude]} icon={droneIcon}>
              <Popup>Abay Drone</Popup>
            </Marker>
          )}

          {route.length > 1 && (
            <Polyline positions={route} color="#2563eb" weight={4} opacity={0.8} />
          )}
        </MapContainer>
      </div>

      {/* Tracking Dashboard */}
      <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-[400] relative w-full md:w-[400px] md:absolute md:top-4 md:right-4 md:bottom-4 md:rounded-3xl md:h-auto flex flex-col overflow-hidden">
        <div className="p-6 pb-0 flex-1 overflow-y-auto">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 capitalize leading-tight">
                {telemetry ? getStatusText(telemetry.status) : getStatusText(order.status)}
              </h2>
              {telemetry?.etaSeconds && (
                <p className="text-blue-600 font-bold mt-1 text-sm">
                  Arriving in <span className="text-lg">{Math.ceil(telemetry.etaSeconds / 60)}</span> mins
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Order Items</h3>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="w-10 h-10 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm">
                    <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover mix-blend-multiply p-1" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'} on the way
              </div>
            </div>
          </div>

          {/* Technical Details Toggle */}
          <button 
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-700 text-sm">Flight Details</span>
            {showTechnicalDetails ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showTechnicalDetails && (
            <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col gap-1">
                <Navigation className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500 font-medium">Altitude</p>
                <p className="text-sm font-bold text-gray-900">{telemetry?.altitude ? `${Math.round(telemetry.altitude)}m` : '--'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col gap-1">
                <Zap className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500 font-medium">Speed</p>
                <p className="text-sm font-bold text-gray-900">{telemetry?.speedKmh ? `${Math.round(telemetry.speedKmh)} km/h` : '--'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col gap-1">
                <Battery className={`w-4 h-4 ${telemetry && telemetry.batteryPercent < 20 ? 'text-red-500' : 'text-gray-400'}`} />
                <p className="text-xs text-gray-500 font-medium">Battery</p>
                <p className="text-sm font-bold text-gray-900">{telemetry?.batteryPercent ? `${Math.round(telemetry.batteryPercent)}%` : '--'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col gap-1">
                <Wind className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500 font-medium">Wind</p>
                <p className="text-sm font-bold text-gray-900">{telemetry?.windSpeedKmh ? `${Math.round(telemetry.windSpeedKmh)} km/h` : '--'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
