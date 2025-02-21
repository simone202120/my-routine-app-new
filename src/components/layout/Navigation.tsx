// components/layout/Navigation.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart2, Settings } from 'lucide-react';
import { Button } from "../ui/button";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/calendar', icon: Calendar, label: 'Calendario' },
    { id: '/stats', icon: BarChart2, label: 'Statistiche' },
    { id: '/settings', icon: Settings, label: 'Impostazioni' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 z-10">
      <div className="flex justify-around items-center">
        {navItems.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            className={`flex flex-col items-center ${
              location.pathname === id ? 'text-primary-600' : 'text-gray-500'
            }`}
            onClick={() => navigate(id)}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs mt-1">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;