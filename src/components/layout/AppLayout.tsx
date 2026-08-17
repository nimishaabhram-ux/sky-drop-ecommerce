import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNavigation } from './MobileNavigation';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative pb-16 md:pb-0">
      <Header />
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
};
