import React, { useState } from 'react';
import { X, Plus, Minus, ShieldCheck, Zap, Weight, Box, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0E0E11] border border-white/20 w-full max-w-lg rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-tech uppercase tracking-[0.3em] font-bold text-neutral-400">
              PAYLOAD SPECIFICATIONS // {product.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Image */}
          <div className="relative aspect-16/10 rounded-sm overflow-hidden bg-neutral-900 border border-white/10">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-white/20 text-[10px] font-mono-tech text-white uppercase">
              {product.category}
            </div>
            <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 backdrop-blur-sm border border-white/20 text-xs font-mono-tech font-bold text-cyan-300">
              {product.weightGrams}g TOTAL MASS
            </div>
          </div>

          {/* Title and Pricing */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                {product.prepTimeMinutes} MIN DISPATCH PREP
              </span>
              <span className="text-xs font-mono-tech text-neutral-400">
                ★ {product.rating} / 5.0 ({product.reviewsCount} reviews)
              </span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight font-display-bold">
              {product.name}
            </h2>
            <div className="mt-2 text-2xl font-black text-white font-mono-tech">
              ${product.price.toFixed(2)}
              {product.originalPrice && (
                <span className="text-sm text-neutral-500 line-through ml-3 font-normal">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-300 leading-relaxed">
            {product.description}
          </p>

          {/* Aviation Pod Specs */}
          <div className="grid grid-cols-2 gap-3 p-3 border border-white/10 bg-white/5 rounded-sm text-xs font-mono-tech">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-neutral-500 text-[10px]">POD DIMENSIONS</div>
                <div className="text-white font-bold">
                  {product.dimensionsCm.width} × {product.dimensionsCm.height} × {product.dimensionsCm.depth} cm
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-neutral-500 text-[10px]">CONTAINMENT</div>
                <div className="text-white font-bold">Aviation Impact Sealed</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 border border-white/15 text-[10px] font-mono-tech uppercase text-neutral-400 rounded-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#0A0A0B] flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-white/20 rounded-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-mono-tech font-bold text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-2.5 bg-white text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 rounded-sm"
          >
            <span>Add to Flight Cargo</span>
            <span className="font-mono-tech">(${(product.price * quantity).toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
