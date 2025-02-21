// components/counters/CounterForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "../ui/button";
import { CounterType } from '../../types';

interface CounterFormProps {
  onClose: () => void;
  onSubmit: (counter: {
    name: string;
    type: CounterType;
  }) => void;
}

const CounterForm: React.FC<CounterFormProps> = ({ onClose, onSubmit }) => {
  const [counterData, setCounterData] = useState({
    name: '',
    type: 'daily' as CounterType
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(counterData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Nuovo Contatore</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={counterData.name}
              onChange={(e) => setCounterData({...counterData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={counterData.type}
              onChange={(e) => setCounterData({
                ...counterData, 
                type: e.target.value as CounterType
              })}
            >
              <option value="daily">Giornaliero</option>
              <option value="total">Totale</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit">
              Salva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterForm;