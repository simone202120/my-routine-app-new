// pages/StatisticsPage.tsx
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { useApp } from '../context/AppContext';

const StatisticsPage = () => {
  const { tasks, counters } = useApp();

  // Calcola le statistiche dei task
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const routine = tasks.filter(task => task.type === 'routine').length;
    const oneTime = tasks.filter(task => task.type === 'oneTime').length;

    return {
      total,
      completed,
      completion: total ? (completed / total * 100).toFixed(1) : 0,
      routine,
      oneTime
    };
  }, [tasks]);

  // Prepara i dati per il grafico a torta dei tipi di task
  const taskTypeData = [
    { name: 'Routine', value: taskStats.routine },
    { name: 'Una tantum', value: taskStats.oneTime }
  ];

  // Prepara i dati per il grafico a barre dei contatori
  const counterData = useMemo(() => {
    return counters.map(counter => ({
      name: counter.name,
      value: counter.currentValue
    }));
  }, [counters]);

  // Colori per i grafici
  const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#14b8a6'];

  return (
    <div className="pb-20 pt-16">
      {/* Riepilogo generale */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Riepilogo Impegni</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">Totale Impegni</p>
            <p className="text-2xl font-bold">{taskStats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">Completati</p>
            <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm col-span-2">
            <p className="text-gray-600">Tasso di Completamento</p>
            <p className="text-2xl font-bold text-primary-600">{taskStats.completion}%</p>
          </div>
        </div>
      </div>

      {/* Grafico distribuzione tipi di task */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Distribuzione Tipi di Impegni</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grafico contatori */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Stato dei Contatori</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={counterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sezione contatori giornalieri */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Contatori Giornalieri</h2>
        <div className="space-y-4">
          {counters
            .filter(counter => counter.type === 'daily')
            .map(counter => (
              <div key={counter.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{counter.name}</p>
                  <p className="text-xl font-bold">{counter.currentValue}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Sezione contatori totali */}
      <div>
        <h2 className="text-xl font-bold mb-4">Contatori Totali</h2>
        <div className="space-y-4">
          {counters
            .filter(counter => counter.type === 'total')
            .map(counter => (
              <div key={counter.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{counter.name}</p>
                  <p className="text-xl font-bold">{counter.currentValue}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;