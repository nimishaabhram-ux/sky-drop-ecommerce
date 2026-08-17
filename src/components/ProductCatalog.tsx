import React, { useState } from 'react';
import { Search, Plus, Check, Zap, Info, Filter, ShieldCheck, Weight } from 'lucide-react';
import { Product } from '../types';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
  onViewProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'ALL PAYLOADS' },
    { id: 'medical', label: 'MEDICAL & FIRST AID' },
    { id: 'food', label: 'GOURMET MEALS' },
    { id: 'bakery', label: 'FRESH BAKERY' },
    { id: 'tech', label: 'TECH & SPARES' },
    { id: 'essentials', label: 'DAILY ESSENTIALS' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full pt-4 space-y-6">
      {/* Header with Bold Typography */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 bg-cyan-400"></span>
          <span className="text-[10px] font-mono-tech uppercase tracking-[0.4em] text-neutral-400 font-bold">
            FLIGHT-READY INVENTORY
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter font-display-bold">
          Autonomous Payload Menu
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
          Aerodynamically packaged goods calibrated for gyro-stabilized pod transport and high-speed winch drop-off.
        </p>
      </div>

      {/* Search & Payload Capacity Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search Bar */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="catalog-search-input"
            type="text"
            placeholder="Search items, supplies, first aid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0E0E11] border border-white/15 text-sm text-white pl-10 pr-4 py-2.5 rounded-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600 font-mono-tech"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono-tech text-neutral-500 hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Payload limit card */}
        <div className="border border-white/10 bg-[#0E0E11] px-4 py-2 flex items-center justify-between rounded-sm">
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-cyan-400" />
            <div className="text-xs font-mono-tech">
              <span className="text-neutral-400">MAX DRONE PAYLOAD:</span>{' '}
              <span className="text-white font-bold">2.5 KG</span>
            </div>
          </div>
          <span className="text-[9px] font-mono-tech px-1.5 py-0.5 border border-emerald-500/30 text-emerald-400">
            OPTIMIZED
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-mono-tech uppercase font-bold tracking-wider rounded-sm transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-white text-black border border-white'
                  : 'bg-[#0E0E11] text-neutral-400 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="border border-white/10 bg-[#0E0E11] p-12 text-center rounded-sm my-6 space-y-3">
          <Info className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">No matching payload items</h3>
          <p className="text-xs text-neutral-400 font-mono-tech max-w-sm mx-auto">
            Try adjusting your search keywords or select a different payload category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 border border-white/20 hover:border-white text-xs font-bold uppercase tracking-wider text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const isJustAdded = addedIds[product.id];

            return (
              <div
                key={product.id}
                onClick={() => onViewProduct(product)}
                className="border border-white/10 bg-[#0E0E11] hover:border-white/30 transition-all rounded-sm overflow-hidden flex flex-col group cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-white/20 text-[9px] font-mono-tech text-white uppercase tracking-wider">
                    {product.category}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-white/20 text-[9px] font-mono-tech text-cyan-300">
                    {product.weightGrams}g
                  </div>

                  {product.isDroneOptimized && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-emerald-500/30 text-[9px] font-mono-tech text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>STABILIZED</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-mono-tech mb-1">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Zap className="w-3 h-3" />
                        {product.prepTimeMinutes} min dispatch
                      </span>
                      <span>★ {product.rating} ({product.reviewsCount})</span>
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-1">
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
                        <span className="text-xs text-neutral-500 line-through ml-1.5">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      id={`prod-btn-add-${product.id}`}
                      onClick={(e) => handleAdd(product, e)}
                      className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1 rounded-sm transition-all ${
                        isJustAdded
                          ? 'bg-emerald-400 text-black'
                          : 'bg-white text-black hover:bg-neutral-200'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
