// components/counters/CounterItem.tsx
import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from "../ui/button";
import { Counter } from '../../types';
import DeleteCounterDialog from './DeleteCounterDialog';

interface CounterItemProps {
  counter: Counter;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
}

const CounterItem: React.FC<CounterItemProps> = ({ 
  counter, 
  onIncrement, 
  onDecrement,
  onDelete
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(counter.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">{counter.name}</h3>
            <p className="text-sm text-gray-500">
              {counter.type === 'daily' ? 'Contatore Giornaliero' : 'Contatore Totale'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-500 transition-colors h-8 w-8"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => onDecrement(counter.id)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-bold text-lg">
              {counter.currentValue}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => onIncrement(counter.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <DeleteCounterDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onDelete={confirmDelete}
        counterName={counter.name}
      />
    </>
  );
};

export default CounterItem;