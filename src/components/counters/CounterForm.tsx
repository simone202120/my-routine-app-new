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
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Nuovo Contatore</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={counterData.name}
              onChange={(e) => setCounterData({
                ...counterData, 
                name: e.target.value
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
            <Button variant="outline" onClick={onClose}>
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