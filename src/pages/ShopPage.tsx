import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Zap } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/common/Button';

const categories = ['All', 'Groceries', 'Food', 'Medicine', 'Essentials', 'Electronics', 'Personal Care'];

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [droneOnly, setDroneOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(p => {
      const matchCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDrone = droneOnly ? p.isDroneOptimized : true;
      return matchCategory && matchSearch && matchDrone;
    });
  }, [activeCategory, searchQuery, droneOnly]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8 min-h-screen">
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl leading-5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm shadow-sm"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDroneOnly(!droneOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-colors ${
              droneOnly 
                ? 'bg-cyan-50 border-cyan-200 text-cyan-700 shadow-sm' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Zap className={`w-4 h-4 ${droneOnly ? 'text-cyan-600' : 'text-gray-400'}`} />
            Drone eligible
          </button>
          
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            Sort
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${
              activeCategory === cat
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{filteredProducts.length} items</p>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
          <Button onClick={() => {
            setSearchQuery('');
            setActiveCategory('All');
            setDroneOnly(false);
          }}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};
