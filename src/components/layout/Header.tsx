// components/layout/Header.tsx
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-gray-900">MyRoutine</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;