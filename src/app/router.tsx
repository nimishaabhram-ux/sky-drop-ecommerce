import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
// We will implement these pages next
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { OrderTrackingPage } from '../pages/OrderTrackingPage';
import { AccountPage } from '../pages/AccountPage';
import { SettingsPage } from '../pages/SettingsPage';
import { DroneSettingsPage } from '../pages/DroneSettingsPage';
import { DroneLocationSetupPage } from '../pages/DroneLocationSetupPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'shop',
        element: <ShopPage />,
      },
      {
        path: 'product/:id',
        element: <ProductPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'orders/:id',
        element: <OrderDetailsPage />,
      },
      {
        path: 'orders/:id/track',
        element: <OrderTrackingPage />,
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'settings/drone',
        element: <DroneSettingsPage />,
      },
      {
        path: 'settings/drone/location/new',
        element: <DroneLocationSetupPage />,
      },
      {
        path: '*',
        element: <div className="p-12 text-center">Page not found</div>,
      }
    ],
  },
]);
