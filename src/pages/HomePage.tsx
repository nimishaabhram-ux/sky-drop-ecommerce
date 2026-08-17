import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Zap, ShoppingBag, Coffee, Apple, Pill, Phone, Laptop, Heart } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/products/ProductCard';

const categories = [
  { name: 'Groceries', icon: Apple, color: 'bg-green-100 text-green-600' },
  { name: 'Food', icon: Coffee, color: 'bg-orange-100 text-orange-600' },
  { name: 'Medicine', icon: Pill, color: 'bg-red-100 text-red-600' },
  { name: 'Essentials', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  { name: 'Electronics', icon: Laptop, color: 'bg-purple-100 text-purple-600' },
  { name: 'Personal Care', icon: Heart, color: 'bg-pink-100 text-pink-600' },
];

export const HomePage: React.FC = () => {
  const popularProducts = INITIAL_PRODUCTS.slice(0, 4);
  const recommendedProducts = INITIAL_PRODUCTS.slice(4, 8);

  return (
    <div className="pb-8">
      {/* Promo Hero Banner */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="bg-blue-600 rounded-3xl overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 px-6 py-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
                Get everyday essentials delivered faster
              </h1>
              <p className="text-blue-100 text-lg md:text-xl mb-8">
                Order groceries, food, medicine and more with standard or drone delivery directly to you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/shop" className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors text-center shadow-sm">
                  Shop now
                </Link>
                <Link to="/settings/drone" className="bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors text-center border border-blue-500">
                  Explore drone delivery
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block w-72 h-72 relative">
              {/* Abstract clean drone/package graphic */}
              <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white/20 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Zap className="w-32 h-32 opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What are you looking for?</h2>
        <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/shop?category=${cat.name}`}
              className="flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px] group"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95 ${cat.color}`}>
                <cat.icon className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Products */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular near you</h2>
          <Link to="/shop" className="text-blue-600 font-medium hover:text-blue-700 flex items-center text-sm">
            See all <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {popularProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Drone Delivery Promo */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Get it faster with Abay Drone
            </h2>
            <p className="text-gray-600 text-lg mb-6 max-w-xl">
              Eligible products can be delivered directly to your saved drone delivery location in 10-15 minutes.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> Faster delivery
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> Live order tracking
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> Saved delivery locations
              </li>
            </ul>
            <Link to="/settings/drone" className="inline-flex bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-cyan-700 transition-colors">
              Set up drone delivery
            </Link>
          </div>
          <div className="hidden md:block w-1/3">
            <img 
              src="https://images.unsplash.com/photo-1579820010410-c10411aaaa88?auto=format&fit=crop&q=80&w=800" 
              alt="Drone Delivery" 
              className="rounded-2xl shadow-lg object-cover h-64 w-full"
            />
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for you</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};

