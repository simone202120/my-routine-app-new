// src/pages/CreateCounterPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "../components/ui/button";
import { CounterType } from '../types';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { PageTransition } from '../components/common/AnimatedComponents';
import { useLayoutContext } from '../context/LayoutContext';

const CreateCounterPage = () => {
  const navigate = useNavigate();
  const { addCounter } = useApp();
  const { setShowFooter } = useLayoutContext();
  
  // Nascondiamo il footer quando la pagina si monta
  useEffect(() => {
    setShowFooter(false);
    
    // Lo mostriamo di nuovo quando la pagina viene smontata
    return () => setShowFooter(true);
  }, [setShowFooter]);
  
  const [counterData, setCounterData] = useState({
    name: '',
    type: 'daily' as CounterType,
    duration: 'day' as 'day' | 'custom',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCounter(counterData);
    navigate(-1); // Torna alla pagina precedente
  };

  return (
    <PageTransition>
      <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-4 border-b bg-white z-10">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)} 
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-bold text-gray-900">Nuovo Contatore</h2>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="overflow-y-auto flex-1 pb-20">
          <div className="container max-w-md mx-auto p-4">
            <form id="counterForm" onSubmit={handleSubmit} className="space-y-6">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durata
                </label>
                <select
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={counterData.duration}
                  onChange={(e) =>
                    setCounterData({ ...counterData, duration: e.target.value as 'day' | 'custom' })
                  }
                >
                  <option value="day">Solo per oggi</option>
                  <option value="custom">Personalizzata</option>
                </select>
              </div>
              {counterData.duration === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data di fine
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={counterData.endDate}
                    onChange={(e) => setCounterData({ ...counterData, endDate: e.target.value })}
                    min={counterData.startDate}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
        
        {/* Footer - Sticky */}
        <div className="sticky bottom-0 left-0 right-0 border-t p-4 bg-white">
          <div className="container max-w-md mx-auto flex justify-between space-x-3">
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-6 py-2 h-12 text-base"
            >
              Annulla
            </Button>
            <Button 
              type="submit"
              form="counterForm"
              className="px-6 py-2 h-12 text-base"
            >
              Salva
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CreateCounterPage;