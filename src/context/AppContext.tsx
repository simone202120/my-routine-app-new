// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { Task, Counter, TaskType, CounterType } from '../types';

interface AppContextType {
  tasks: Task[];
  counters: Counter[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  addCounter: (counter: Omit<Counter, 'id' | 'currentValue'>) => Promise<void>;
  incrementCounter: (counterId: string) => Promise<void>;
  decrementCounter: (counterId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteCounter: (counterId: string) => Promise<void>;
  resetDailyCounters: () => Promise<void>;
  resetAllData: () => Promise<void>;
  deleteRoutineOccurrence: (taskId: string, date: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch user data from Firestore
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setCounters([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Subscribe to tasks collection
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
      setTasks(tasksData);
    });

    // Subscribe to counters collection
    const countersQuery = query(
      collection(db, 'counters'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribeCounters = onSnapshot(countersQuery, (snapshot) => {
      const countersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Counter));
      setCounters(countersData);
      setIsLoading(false);
    });

    // Check if daily counters need to be reset
    const checkAndResetCounters = async () => {
      const lastResetDoc = await getDocs(
        query(collection(db, 'userSettings'), where('userId', '==', currentUser.uid))
      );
      
      if (!lastResetDoc.empty) {
        const userSettings = lastResetDoc.docs[0].data();
        const lastReset = userSettings.lastCounterReset;
        const today = new Date().toDateString();
        
        if (lastReset !== today) {
          await resetDailyCounters();
          await updateDoc(lastResetDoc.docs[0].ref, { lastCounterReset: today });
        }
      } else {
        // Create settings document if it doesn't exist
        await addDoc(collection(db, 'userSettings'), {
          userId: currentUser.uid,
          lastCounterReset: new Date().toDateString()
        });
      }
    };
    
    checkAndResetCounters();
    
    return () => {
      unsubscribeTasks();
      unsubscribeCounters();
    };
  }, [currentUser]);

  const addTask = async (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    if (!currentUser) return;
    
    const newTask = {
      ...taskData,
      isCompleted: false,
      userId: currentUser.uid,
      createdAt: new Date()
    };
    
    await addDoc(collection(db, 'tasks'), newTask);
  };

  const toggleTaskComplete = async (taskId: string) => {
    if (!currentUser) return;
    
    const taskToToggle = tasks.find(task => task.id === taskId);
    if (!taskToToggle) return;
    
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      isCompleted: !taskToToggle.isCompleted
    });
  };

  const deleteTask = async (taskId: string) => {
    if (!currentUser) return;
    
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  };

  const deleteRoutineOccurrence = async (taskId: string, date: string) => {
    if (!currentUser) return;
    
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate || taskToUpdate.type !== 'routine') return;
    
    const excludedDates = taskToUpdate.excludedDates || [];
    
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      excludedDates: [...excludedDates, date]
    });
  };

  const addCounter = async (counterData: Omit<Counter, 'id' | 'currentValue'>) => {
    if (!currentUser) return;
    
    const newCounter = {
      ...counterData,
      currentValue: 0,
      userId: currentUser.uid,
      createdAt: new Date()
    };
    
    await addDoc(collection(db, 'counters'), newCounter);
  };

  const incrementCounter = async (counterId: string) => {
    if (!currentUser) return;
    
    const counterToIncrement = counters.find(counter => counter.id === counterId);
    if (!counterToIncrement) return;
    
    const counterRef = doc(db, 'counters', counterId);
    await updateDoc(counterRef, {
      currentValue: counterToIncrement.currentValue + 1
    });
  };

  const decrementCounter = async (counterId: string) => {
    if (!currentUser) return;
    
    const counterToDecrement = counters.find(counter => counter.id === counterId);
    if (!counterToDecrement || counterToDecrement.currentValue <= 0) return;
    
    const counterRef = doc(db, 'counters', counterId);
    await updateDoc(counterRef, {
      currentValue: counterToDecrement.currentValue - 1
    });
  };

  const deleteCounter = async (counterId: string) => {
    if (!currentUser) return;
    
    const counterRef = doc(db, 'counters', counterId);
    await deleteDoc(counterRef);
  };

  const resetDailyCounters = async () => {
    if (!currentUser) return;
    
    const dailyCounters = counters.filter(counter => counter.type === 'daily');
    
    for (const counter of dailyCounters) {
      const counterRef = doc(db, 'counters', counter.id);
      await updateDoc(counterRef, { currentValue: 0 });
    }
  };

  const resetAllData = async () => {
    if (!currentUser) return;
    
    // Delete all tasks
    for (const task of tasks) {
      await deleteDoc(doc(db, 'tasks', task.id));
    }
    
    // Delete all counters
    for (const counter of counters) {
      await deleteDoc(doc(db, 'counters', counter.id));
    }
  };

  const value = {
    tasks,
    counters,
    isLoading,
    addTask,
    toggleTaskComplete,
    addCounter,
    incrementCounter,
    decrementCounter,
    deleteTask,
    deleteCounter,
    resetDailyCounters,
    resetAllData,
    deleteRoutineOccurrence
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};