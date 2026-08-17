/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { CartItem, Order, Product } from './types';
import { INITIAL_USER, INITIAL_WEATHER, INITIAL_PRODUCTS, INITIAL_LOCATIONS, INITIAL_ACTIVE_ORDER } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_ACTIVE_ORDER);
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderPlaced = (order: Order) => {
    setActiveOrder(order);
    setActiveTab('track');
  };

  return (
    <div className="min-h-full flex flex-col relative pb-16">
      <Navbar 
        user={INITIAL_USER}
        cart={cart}
        notifications={[]}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenNotifications={() => {}}
        onOpenAccount={() => {}}
        onOpenAuth={() => {}}
      />

      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {activeTab === 'home' && (
          <HomeScreen 
            user={INITIAL_USER}
            weather={INITIAL_WEATHER}
            locations={INITIAL_LOCATIONS}
            activeOrder={activeOrder}
            products={INITIAL_PRODUCTS}
            onSelectTab={setActiveTab}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onViewProduct={setSelectedProduct}
            onStartSetup={() => setActiveTab('drone-setup')}
          />
        )}

        {activeTab === 'catalog' && (
          <ProductCatalog 
            products={INITIAL_PRODUCTS}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onViewProduct={setSelectedProduct}
          />
        )}
        
        {/* Placeholders for other tabs */}
        {(activeTab === 'track' || activeTab === 'drone-setup' || activeTab === 'account') && (
          <div className="flex-1 flex items-center justify-center text-neutral-500 font-mono-tech uppercase tracking-widest p-8 text-center">
            {activeTab.replace('-', ' ')} module under construction
          </div>
        )}
      </main>

      <BottomNav 
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeOrderCount={activeOrder && activeOrder.status !== 'DELIVERED' ? 1 : 0}
      />

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartCheckoutModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        locations={INITIAL_LOCATIONS}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        onStartSetup={() => {
          setIsCartOpen(false);
          setActiveTab('drone-setup');
        }}
        onOrderPlaced={handleOrderPlaced}
      />
    </div>
  );
}
