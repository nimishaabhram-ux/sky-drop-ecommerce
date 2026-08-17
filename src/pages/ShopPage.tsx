import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { ProductCard } from '../components/products/ProductCard';
import { useCart } from '../context/CartContext';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const categoryFilter = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [droneOnly, setDroneOnly] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'medical', name: 'Medical' },
    { id: 'food', name: 'Food & Bakery' },
    { id: 'tech', name: 'Tech' },
    { id: 'essentials', name: 'Essentials' },
  ];

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // Category filter (grouping food and bakery together for simplicity in UI if needed, but keeping separate in data)
      if (categoryFilter && categoryFilter !== 'all') {
        if (categoryFilter === 'food' && !['food', 'bakery'].includes(product.category)) return false;
        else if (categoryFilter !== 'food' && product.category !== categoryFilter) return false;
      }
      
      // Drone filter
      if (droneOnly && !product.isDroneOptimized) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(query) || 
               product.description.toLowerCase().includes(query) ||
               product.tags.some(t => t.toLowerCase().includes(query));
      }
      
      return true;
    });
  }, [categoryFilter, droneOnly, searchQuery]);

  const handleCategoryChange = (id: string) => {
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Shop</h1>
        <p className="text-slate-600">Browse our selection of everyday essentials.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg shrink-0">
            {categories.map((cat) => {
              const isActive = (categoryFilter === cat.id) || (!categoryFilter && cat.id === 'all');
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 shrink-0 cursor-pointer">
            <input 
              type="checkbox" 
              checked={droneOnly}
              onChange={(e) => setDroneOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Drone delivery only</span>
          </label>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={(p) => addToCart(p, 1)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No products found</h3>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};
