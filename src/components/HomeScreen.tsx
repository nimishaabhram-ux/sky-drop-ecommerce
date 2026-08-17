import React from 'react';
import { 
  Plane, 
  MapPin, 
  Radio, 
  ArrowUpRight, 
  Wind, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ChevronRight, 
  Plus, 
  Check, 
  Sparkles,
  Navigation
} from 'lucide-react';
import { DeliveryLocation, FlightWeather, Order, Product, User } from '../types';
import { ActiveTab } from './BottomNav';

interface HomeScreenProps {
  user: User | null;
  weather: FlightWeather;
  locations: DeliveryLocation[];
  activeOrder: Order | null;
  products: Product[];
  onSelectTab: (tab: ActiveTab) => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onStartSetup: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  weather,
  locations,
  activeOrder,
  products,
  onSelectTab,
  onAddToCart,
  onViewProduct,
  onStartSetup,
}) => {
  const verifiedLocations = locations.filter((l) => l.status === 'verified');
  const defaultLocation = locations.find((l) => l.isDefault) || locations[0];

  return (
    <div className="flex-1 flex flex-col pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full pt-4 space-y-6">
      {/* Massive Bold Headline Banner */}
      <section className="relative overflow-hidden border border-white/10 bg-[#0E0E11] p-6 sm:p-8 rounded-sm">
        <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none select-none text-9xl font-black font-mono-tech tracking-tighter text-white">
          AERO
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[10px] uppercase font-mono-tech tracking-[0.4em] font-bold text-neutral-400">
              Fleet System Online // Sector 04
            </span>
          </div>

          <h1 className="massive-heading text-white">
            DIRECT<br />
            <span className="outline-text">AERO DROP</span>
          </h1>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-white/10 pt-4">
            <p className="max-w-md text-sm sm:text-base font-medium text-neutral-400 leading-relaxed">
              Autonomous electric multi-rotor couriers delivering vital supplies, fresh provisions, and tech gear to your verified coordinates in under 10 minutes.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                id="hero-order-now-btn"
                onClick={() => onSelectTab('catalog')}
                className="px-5 py-2.5 bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 rounded-sm shadow-lg"
              >
                <span>Deploy Order</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                id="hero-scan-lz-btn"
                onClick={onStartSetup}
                className="px-4 py-2.5 border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-all flex items-center gap-2 rounded-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Configure LZ</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Live Flight Order Card (If active) */}
      {activeOrder && activeOrder.status !== 'DELIVERED' && activeOrder.status !== 'CANCELLED' && (
        <section className="border border-white/20 bg-[#121216] p-4 sm:p-5 rounded-sm relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-[10px] font-mono-tech uppercase font-bold tracking-widest text-cyan-300">
                ACTIVE FLIGHT TELEMETRY // {activeOrder.id}
              </span>
            </div>
            <span className="px-2 py-0.5 border border-cyan-400/30 text-[10px] font-mono-tech text-cyan-300 uppercase tracking-wider">
              {activeOrder.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2 flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm shrink-0">
                <Plane className="w-6 h-6 text-white animate-drone-float" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {activeOrder.items.map((i) => i.product.name).join(', ')}
                </h4>
                <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono-tech">
                  <span>DEST: {activeOrder.deliveryLocation?.name || 'Registered LZ'}</span>
                  <span>•</span>
                  <span className="text-white font-bold">DRONE: {activeOrder.droneId || 'FALCON-X9'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono-tech text-neutral-500 tracking-wider">EST. ARRIVAL</div>
                <div className="text-lg font-black font-mono-tech text-emerald-400">
                  ~{activeOrder.estimatedDeliveryMinutes} MIN
                </div>
              </div>

              <button
                id="view-live-tracking-btn"
                onClick={() => onSelectTab('track')}
                className="px-4 py-2 bg-cyan-400 text-black text-xs font-black uppercase tracking-wider hover:bg-cyan-300 transition-colors flex items-center gap-1.5 rounded-sm"
              >
                <span>Live Radar</span>
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Quick Action Bento Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Order Fast */}
        <div
          onClick={() => onSelectTab('catalog')}
          className="p-4 sm:p-5 border border-white/10 bg-[#0E0E11] hover:border-white/30 transition-all cursor-pointer rounded-sm flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-white rounded-sm group-hover:bg-white group-hover:text-black transition-colors">
              <Zap className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono-tech text-neutral-500 tracking-widest mb-1">CATALOG</div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">Order Provisions</h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">Medical kits, tech spares, espresso pods, artisan breads.</p>
          </div>
        </div>

        {/* Card 2: 360 Drone Landing Setup */}
        <div
          onClick={onStartSetup}
          className="p-4 sm:p-5 border border-white/10 bg-[#0E0E11] hover:border-cyan-400/50 transition-all cursor-pointer rounded-sm flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 rounded-sm group-hover:bg-cyan-400 group-hover:text-black transition-colors">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono-tech px-1.5 py-0.5 border border-cyan-400/40 text-cyan-300">
              {verifiedLocations.length} ACTIVE
            </span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono-tech text-neutral-500 tracking-widest mb-1">SCANNING</div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">Setup Landing Zone</h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">GPS acquisition & 8-angle camera obstacle mapping.</p>
          </div>
        </div>

        {/* Card 3: Live Telemetry Radar */}
        <div
          onClick={() => onSelectTab('track')}
          className="p-4 sm:p-5 border border-white/10 bg-[#0E0E11] hover:border-white/30 transition-all cursor-pointer rounded-sm flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-white rounded-sm group-hover:bg-white group-hover:text-black transition-colors">
              <Radio className="w-4 h-4" />
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono-tech text-neutral-500 tracking-widest mb-1">RADAR</div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">Live Tracking</h3>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">Real-time altitude, battery, speed, and winch descent status.</p>
          </div>
        </div>

        {/* Card 4: Airspace & Weather */}
        <div className="p-4 sm:p-5 border border-white/10 bg-[#0E0E11] rounded-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-mono-tech text-neutral-400">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>{weather.windSpeedKmh} KM/H {weather.windDirection}</span>
            </div>
            <span className="text-[9px] font-mono-tech text-emerald-400 font-bold">
              {weather.droneFlyabilityScore}% FLYABLE
            </span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono-tech text-neutral-500 tracking-widest mb-1">ATMOSPHERE</div>
            <div className="text-sm font-bold text-white flex items-center justify-between">
              <span>{weather.condition.toUpperCase()}</span>
              <span className="font-mono-tech text-neutral-300">{weather.temperatureC}°C</span>
            </div>
            <div className="text-[10px] font-mono-tech text-neutral-500 mt-1">
              VIS: {weather.visibilityKm}KM // {weather.airspaceStatus}
            </div>
          </div>
        </div>
      </section>

      {/* Registered Landing Zone Status Bar */}
      <section className="p-4 border border-white/10 bg-[#0E0E11] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 rounded-sm shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                PRIMARY LANDING ZONE: {defaultLocation ? defaultLocation.name : 'Not Configured'}
              </span>
              {defaultLocation && (
                <span className="text-[9px] font-mono-tech px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 uppercase">
                  VERIFIED ({defaultLocation.clearanceScore}%)
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono-tech text-neutral-400">
              {defaultLocation
                ? `GPS: ${defaultLocation.latitude.toFixed(4)}, ${defaultLocation.longitude.toFixed(4)} (±${defaultLocation.gpsAccuracy}m) • ${defaultLocation.groundSurface}`
                : 'Configure safe 3m clearance area using device GPS and camera'}
            </p>
          </div>
        </div>

        <button
          id="manage-lz-btn"
          onClick={onStartSetup}
          className="px-3.5 py-1.5 border border-white/20 hover:border-white text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 transition-colors self-start sm:self-center shrink-0"
        >
          {defaultLocation ? 'Inspect / Re-Scan' : 'Scan New Zone'}
        </button>
      </section>

      {/* Featured Drone-Optimized Catalog Section */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-white/10 pb-3">
          <div>
            <div className="text-[10px] uppercase font-mono-tech tracking-[0.3em] text-neutral-500 font-bold mb-1">
              PAYLOAD READY
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase font-display-bold">
              Available For Fast Drop
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('catalog')}
            className="text-xs font-mono-tech uppercase font-bold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="border border-white/10 bg-[#0E0E11] hover:border-white/30 transition-all rounded-sm overflow-hidden flex flex-col group"
            >
              {/* Product Image */}
              <div 
                onClick={() => onViewProduct(product)}
                className="relative aspect-4/3 overflow-hidden bg-neutral-900 cursor-pointer"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-white/20 text-[9px] font-mono-tech text-white uppercase tracking-wider">
                  {product.category}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-white/20 text-[9px] font-mono-tech text-cyan-300">
                  {product.weightGrams}g
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 font-mono-tech mb-1">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Zap className="w-3 h-3" />
                      {product.prepTimeMinutes}m prep
                    </span>
                    <span>★ {product.rating}</span>
                  </div>
                  <h3 
                    onClick={() => onViewProduct(product)}
                    className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="font-mono-tech">
                    <span className="text-base font-black text-white">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-neutral-500 line-through ml-2">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    id={`add-home-prod-${product.id}`}
                    onClick={() => onAddToCart(product)}
                    className="p-2 bg-white text-black hover:bg-neutral-200 transition-colors rounded-sm text-xs font-bold"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety & Protocol Footer Strip */}
      <section className="border border-white/10 bg-[#0A0A0B] p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-neutral-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-neutral-400" />
          <span>FAA PART 135 & EASA CERTIFIED BVLOS OPERATIONS</span>
        </div>
        <div className="flex items-center gap-4">
          <span>AES-256 TELEMETRY</span>
          <span>•</span>
          <span>PARACHUTE RECOVERY EQUIPPED</span>
        </div>
      </section>
    </div>
  );
};
