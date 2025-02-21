// components/counters/CounterItem.tsx
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from "../ui/button";
import { Counter } from '../../types';

interface CounterItemProps {
  counter: Counter;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

const CounterItem: React.FC<CounterItemProps> = ({ 
  counter, 
  onIncrement, 
  onDecrement 
}) => {
  return (
    <div className="p-4 rounded-lg bg-white border">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">{counter.name}</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDecrement(counter.id)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-bold">
            {counter.currentValue}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onIncrement(counter.id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CounterItem;