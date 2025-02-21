// pages/HomePage.tsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "../components/ui/button";
import TaskItem from '../components/tasks/TaskItem';
import CounterItem from '../components/counters/CounterItem';
import TaskForm from '../components/tasks/TaskForm';
import CounterForm from '../components/counters/CounterForm';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const HomePage = () => {
  // Utilizziamo il context invece dello stato locale
  const {
    tasks,
    counters,
    addTask,
    toggleTaskComplete,
    addCounter,
    incrementCounter,
    decrementCounter
  } = useApp();

  // Stati per i modal
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isCounterFormOpen, setIsCounterFormOpen] = useState(false);

  // Filtra i task di oggi
  const todayTasks = tasks.filter(task => {
    if (task.type === 'routine') return true;
    return task.date === format(new Date(), 'yyyy-MM-dd');
  });

  // Filtra i contatori giornalieri
  const dailyCounters = counters.filter(counter => counter.type === 'daily');
  const totalCounters = counters.filter(counter => counter.type === 'total');

  return (
    <div className="pb-20 pt-16">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsTaskFormOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Nuovo impegno
        </Button>
        <Button 
          className="flex items-center gap-2"
          variant="outline"
          onClick={() => setIsCounterFormOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Nuovo contatore
        </Button>
      </div>

      {/* Tasks Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">I tuoi impegni oggi</h2>
        <div className="space-y-3">
          {todayTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={toggleTaskComplete}
            />
          ))}
          {todayTasks.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nessun impegno per oggi
            </p>
          )}
        </div>
      </div>

      {/* Daily Counters Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Contatori Giornalieri</h2>
        <div className="grid grid-cols-1 gap-3">
          {dailyCounters.map(counter => (
            <CounterItem
              key={counter.id}
              counter={counter}
              onIncrement={incrementCounter}
              onDecrement={decrementCounter}
            />
          ))}
          {dailyCounters.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nessun contatore giornaliero
            </p>
          )}
        </div>
      </div>

      {/* Total Counters Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Contatori Totali</h2>
        <div className="grid grid-cols-1 gap-3">
          {totalCounters.map(counter => (
            <CounterItem
              key={counter.id}
              counter={counter}
              onIncrement={incrementCounter}
              onDecrement={decrementCounter}
            />
          ))}
          {totalCounters.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nessun contatore totale
            </p>
          )}
        </div>
      </div>

      {/* Forms modali */}
      {isTaskFormOpen && (
        <TaskForm
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={(taskData) => {
            addTask(taskData);
            setIsTaskFormOpen(false);
          }}
        />
      )}
      {isCounterFormOpen && (
        <CounterForm
          onClose={() => setIsCounterFormOpen(false)}
          onSubmit={(counterData) => {
            addCounter(counterData);
            setIsCounterFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;