// components/layout/Layout.tsx
import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-24 pt-20 max-w-2xl">
        {children}
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;