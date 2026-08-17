import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Box, Clock } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';

export const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  
  // Get subsets of products for different sections
  const popularProducts = mockProducts.slice(0, 4);
  const droneProducts = mockProducts.filter(p => p.isDroneOptimized).slice(0, 4);

  const categories = [
    { id: 'medical', name: 'Medical', icon: '💊', color: 'bg-red-50 text-red-700' },
    { id: 'food', name: 'Food', icon: '🍔', color: 'bg-amber-50 text-amber-700' },
    { id: 'bakery', name: 'Bakery', icon: '🥐', color: 'bg-orange-50 text-orange-700' },
    { id: 'tech', name: 'Tech', icon: '💻', color: 'bg-blue-50 text-blue-700' },
    { id: 'essentials', name: 'Essentials', icon: '🧻', color: 'bg-teal-50 text-teal-700' },
  ];

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white rounded-b-3xl md:rounded-3xl md:mt-6 overflow-hidden mx-0 md:mx-4 lg:mx-8">
        {/* Subtle background element */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative px-6 py-16 sm:py-24 md:p-20 flex flex-col items-start max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Everyday essentials, <span className="text-blue-400">delivered faster.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-lg leading-relaxed">
            Order food, essentials, medical supplies and technology with standard or drone delivery where available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/shop" className="w-full sm:w-auto">
              <Button size="lg" fullWidth className="bg-blue-600 hover:bg-blue-500 text-white border-0">
                Shop now
              </Button>
            </Link>
            <Link to="/settings/drone/location/new" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" fullWidth className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
                Set up drone delivery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Ultra-fast delivery</h3>
              <p className="text-sm text-slate-500">Drone delivery in under 15 mins</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center shrink-0">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Safe & secure</h3>
              <p className="text-sm text-slate-500">Precision landing technology</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Real-time tracking</h3>
              <p className="text-sm text-slate-500">Know exactly where your order is</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Shop by category</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/shop?category=${cat.id}`}
              className="flex flex-col items-center gap-3 snap-start min-w-[100px] sm:min-w-[120px] group"
            >
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${cat.color} flex items-center justify-center text-3xl sm:text-4xl transition-transform group-hover:scale-105 shadow-sm border border-slate-100`}>
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-slate-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Popular near you</h2>
          <Link to="/shop" className="text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {popularProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={(p) => addToCart(p, 1)} 
            />
          ))}
        </div>
      </section>

      {/* Fast Drone Delivery Section */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Fast drone delivery</h2>
          <p className="text-slate-600 max-w-xl mb-6">
            Get these items delivered to your home or outdoor location in minutes using our autonomous drone fleet.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full text-left">
            {droneProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={(p) => addToCart(p, 1)} 
              />
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};
