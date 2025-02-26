// pages/StatisticsPage.tsx - Aggiornato con la cronologia dei contatori
import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Clock, Target, ChevronDown, ChevronUp } from 'lucide-react';
import CounterHistory from '../components/counters/CounterHistory';
import { Button } from '../components/ui/button';

const StatisticsPage = () => {
  const { tasks, counters, counterEntries } = useApp();
  const [expandedCounter, setExpandedCounter] = useState<string | null>(null);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const routine = tasks.filter(task => task.type === 'routine').length;
    const oneTime = tasks.filter(task => task.type === 'oneTime').length;

    return {
      total,
      completed,
      completion: total ? Math.round((completed / total) * 100) : 0,
      routine,
      oneTime
    };
  }, [tasks]);

  // Ottieni contatori unici dalle voci storiche
  const uniqueCounterIds = useMemo(() => {
    const ids = new Set<string>();
    counterEntries.forEach(entry => {
      ids.add(entry.counterId);
    });
    return Array.from(ids);
  }, [counterEntries]);

  // Mappa degli ID dei contatori ai loro nomi
  const counterNames = useMemo(() => {
    const names = new Map<string, string>();
    
    // Prima aggiungi i nomi dai contatori attuali
    counters.forEach(counter => {
      names.set(counter.id, counter.name);
    });
    
    // Poi aggiungi nomi dalle voci storiche (per contatori che potrebbero essere stati eliminati)
    counterEntries.forEach(entry => {
      if (!names.has(entry.counterId) && entry.name) {
        names.set(entry.counterId, entry.name);
      }
    });
    
    return names;
  }, [counters, counterEntries]);

  const taskTypeData = [
    { name: 'Routine', value: taskStats.routine },
    { name: 'Una tantum', value: taskStats.oneTime }
  ];

  // More distinct colors with good contrast
  const COLORS = ['#5bb584', '#274e23'];  // Green and orange

  // Custom tooltip for mobile friendliness
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-2 rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p>{data.value} impegni ({((data.value / taskStats.total) * 100).toFixed(1)}%)</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend for better readability
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center space-x-4 mt-2">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <span 
              className="inline-block w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.value} ({entry.payload.value})
            </span>
          </div>
        ))}
      </div>
    );
  };

  const toggleExpandCounter = (counterId: string) => {
    if (expandedCounter === counterId) {
      setExpandedCounter(null);
    } else {
      setExpandedCounter(counterId);
    }
  };

  // Raggruppa le voci dei contatori per counterId
  const counterEntriesByCounter = useMemo(() => {
    const grouped = new Map<string, number>();
    
    uniqueCounterIds.forEach(counterId => {
      // Trova tutte le voci per questo contatore
      const entries = counterEntries.filter(entry => entry.counterId === counterId);
      // Calcola il totale delle voci
      const count = entries.length;
      grouped.set(counterId, count);
    });
    
    return grouped;
  }, [counterEntries, uniqueCounterIds]);

  return (
    <div className="space-y-6">
      {/* Card statistiche generali */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Impegni Totali</p>
              <p className="text-2xl font-bold mt-1">{taskStats.total}</p>
            </div>
            <Target className="h-8 w-8 text-primary-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completati</p>
              <p className="text-2xl font-bold mt-1">{taskStats.completed}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-primary-500" />
          </div>
        </div>
        <div className="col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tasso di Completamento</p>
              <p className="text-2xl font-bold mt-1">{taskStats.completion}%</p>
            </div>
            <Clock className="h-8 w-8 text-primary-500" />
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${taskStats.completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grafico distribuzione tipi di task */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Distribuzione Impegni</h2>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskTypeData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                
              >
                {taskTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contatori Attuali */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Contatori Giornalieri</h2>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          {counters.filter(c => c.type === 'daily').map(counter => (
            <div key={counter.id} className="py-3 first:pt-0 last:pb-0 border-b last:border-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{counter.name}</p>
                  <p className="text-sm text-gray-500">Oggi</p>
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  {counter.currentValue}
                </div>
              </div>
            </div>
          ))}
          {counters.filter(c => c.type === 'daily').length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Nessun contatore giornaliero
            </p>
          )}
        </div>

        <h2 className="text-lg font-semibold">Contatori Totali</h2>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          {counters.filter(c => c.type === 'total').map(counter => (
            <div key={counter.id} className="py-3 first:pt-0 last:pb-0 border-b last:border-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{counter.name}</p>
                  <p className="text-sm text-gray-500">Totale</p>
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  {counter.currentValue}
                </div>
              </div>
            </div>
          ))}
          {counters.filter(c => c.type === 'total').length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Nessun contatore totale
            </p>
          )}
        </div>
      </div>

      {/* Cronologia Contatori */}
      {uniqueCounterIds.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Cronologia Contatori</h2>
          
          {uniqueCounterIds.map(counterId => {
            const counterName = counterNames.get(counterId) || 'Contatore';
            const entriesCount = counterEntriesByCounter.get(counterId) || 0;
            const isExpanded = expandedCounter === counterId;
            
            return (
              <div key={counterId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpandCounter(counterId)}
                >
                  <div>
                    <p className="font-medium">{counterName}</p>
                    <p className="text-sm text-gray-500">{entriesCount} {entriesCount === 1 ? 'registrazione' : 'registrazioni'}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                
                {isExpanded && (
                  <div className="border-t">
                    <CounterHistory counterId={counterId} counterName={counterName} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;