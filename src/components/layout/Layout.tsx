// src/components/layout/Layout.tsx
import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;  // Cambiato da export { Layout } a export default Layout