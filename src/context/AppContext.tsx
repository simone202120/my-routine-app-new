// context/AppContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Task, Counter, TaskType, CounterType } from '../types';

interface AppContextType {
  tasks: Task[];
  counters: Counter[];
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  toggleTaskComplete: (taskId: string) => void;
  addCounter: (counter: Omit<Counter, 'id' | 'currentValue'>) => void;
  incrementCounter: (counterId: string) => void;
  decrementCounter: (counterId: string) => void;
  deleteTask: (taskId: string) => void;
  deleteCounter: (counterId: string) => void;
  resetDailyCounters: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Chiavi per il localStorage
const STORAGE_KEYS = {
  TASKS: 'myRoutine_tasks',
  COUNTERS: 'myRoutine_counters',
  LAST_RESET: 'myRoutine_lastReset'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inizializza lo stato con i dati dal localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [counters, setCounters] = useState<Counter[]>(() => {
    const savedCounters = localStorage.getItem(STORAGE_KEYS.COUNTERS);
    return savedCounters ? JSON.parse(savedCounters) : [];
  });

  // Salva le modifiche nel localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
  }, [counters]);

  // Resetta i contatori giornalieri a mezzanotte
  useEffect(() => {
    const checkAndResetCounters = () => {
      const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_RESET);
      const today = new Date().toDateString();

      if (lastReset !== today) {
        resetDailyCounters();
        localStorage.setItem(STORAGE_KEYS.LAST_RESET, today);
      }
    };

    checkAndResetCounters();

    // Controlla ogni minuto se è necessario resettare
    const interval = setInterval(checkAndResetCounters, 60000);
    return () => clearInterval(interval);
  }, []);

  const resetDailyCounters = useCallback(() => {
    setCounters(prev => 
      prev.map(counter => 
        counter.type === 'daily' 
          ? { ...counter, currentValue: 0 }
          : counter
      )
    );
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      isCompleted: false
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const toggleTaskComplete = useCallback((taskId: string) => {
    setTasks(prev => 
      prev.map(task =>
        task.id === taskId 
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const addCounter = useCallback((counterData: Omit<Counter, 'id' | 'currentValue'>) => {
    const newCounter: Counter = {
      id: Date.now().toString(),
      ...counterData,
      currentValue: 0
    };
    setCounters(prev => [...prev, newCounter]);
  }, []);

  const incrementCounter = useCallback((counterId: string) => {
    setCounters(prev =>
      prev.map(counter =>
        counter.id === counterId
          ? { ...counter, currentValue: counter.currentValue + 1 }
          : counter
      )
    );
  }, []);

  const decrementCounter = useCallback((counterId: string) => {
    setCounters(prev =>
      prev.map(counter =>
        counter.id === counterId && counter.currentValue > 0
          ? { ...counter, currentValue: counter.currentValue - 1 }
          : counter
      )
    );
  }, []);

  const deleteCounter = useCallback((counterId: string) => {
    setCounters(prev => prev.filter(counter => counter.id !== counterId));
  }, []);

  return (
    <AppContext.Provider value={{
      tasks,
      counters,
      addTask,
      toggleTaskComplete,
      addCounter,
      incrementCounter,
      decrementCounter,
      deleteTask,
      deleteCounter,
      resetDailyCounters
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};