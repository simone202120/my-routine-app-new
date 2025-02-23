// components/layout/Navigation.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart2, Settings, LucideIcon } from 'lucide-react';
import { Button } from "../ui/button";

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
}

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { 
      id: '/', 
      icon: Home, 
      label: 'Home',
      color: '#ea580c'
    },
    { 
      id: '/calendar', 
      icon: Calendar, 
      label: 'Calendario',
      color: '#0ea5e9'
    },
    { 
      id: '/stats', 
      icon: BarChart2, 
      label: 'Statistiche',
      color: '#8b5cf6'
    },
    { 
      id: '/settings', 
      icon: Settings, 
      label: 'Impostazioni',
      color: '#10b981'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex justify-around py-2">
          {navItems.map(({ id, icon: Icon, label, color }) => {
            const isActive = location.pathname === id;
            
            return (
              <Button
                key={id}
                variant="ghost"
                className={`flex flex-col items-center min-w-[4rem] h-auto py-2 ${
                  isActive ? 'text-gray-900' : 'text-gray-500'
                }`}
                onClick={() => navigate(id)}
              >
                <div className="h-4 w-4 mb-1">
                  <Icon 
                    className="w-full h-full" 
                    color={isActive ? color : 'currentColor'} 
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                </div>
                <span className="text-xs font-medium">
                  {label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;