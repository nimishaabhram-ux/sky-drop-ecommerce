import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNavigation } from './components/layout/MobileNavigation';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { SettingsPage } from './pages/SettingsPage';
import { DroneSettingsPage } from './pages/DroneSettingsPage';
import { DroneLocationSetupPage } from './pages/DroneLocationSetupPage';
import { AddressesPage } from './pages/AddressesPage';
import { PaymentsPage, NotificationsPage, SecurityPage } from './pages/MockSettingsPages';

// Context Providers
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans pb-16 md:pb-0">
          <Header />
          <main className="flex-1 w-full relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailsPage />} />
              <Route path="/orders/:id/track" element={<OrderTrackingPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/settings/profile" element={<SettingsPage />} />
              <Route path="/settings/addresses" element={<AddressesPage />} />
              <Route path="/settings/payments" element={<PaymentsPage />} />
              <Route path="/settings/notifications" element={<NotificationsPage />} />
              <Route path="/settings/security" element={<SecurityPage />} />
              <Route path="/settings/drone" element={<DroneSettingsPage />} />
              <Route path="/settings/drone/location/new" element={<DroneLocationSetupPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <MobileNavigation />
        </div>
      </Router>
    </CartProvider>
  );
}
