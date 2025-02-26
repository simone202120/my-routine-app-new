// src/context/AppContext.tsx - Aggiornato con gestione cronologia contatori
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
import { Task, Counter, TaskType, CounterType, CounterEntry } from '../types';
import { format, isToday } from 'date-fns';
import NotificationService from '../services/NotificationService';
import { CounterEntriesService } from '../services/CounterEntriesService';

interface AppContextType {
  tasks: Task[];
  counters: Counter[];
  counterEntries: CounterEntry[];
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
  getCounterHistory: (counterId: string) => Promise<CounterEntry[]>;
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
  const [counterEntries, setCounterEntries] = useState<CounterEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Inizializza il servizio di notifiche
  const notificationService = NotificationService.getInstance();

  // Fetch user data from Firestore
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setCounters([]);
      setCounterEntries([]);
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
      
      // Aggiorna il servizio di notifiche con i nuovi task
      notificationService.updateTasks(tasksData);
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
    });
    
    // Recupera le voci storiche dei contatori
    const fetchCounterEntries = async () => {
      try {
        const entries = await CounterEntriesService.getAllCounterEntries(currentUser.uid);
        setCounterEntries(entries);
      } catch (error) {
        console.error("Errore nel recuperare le voci storiche dei contatori:", error);
      }
    };
    
    fetchCounterEntries();

    // Check if daily counters need to be reset
    const checkAndResetCounters = async () => {
      const lastResetDoc = await getDocs(
        query(collection(db, 'userSettings'), where('userId', '==', currentUser.uid))
      );
      
      const today = new Date().toDateString();
      
      if (!lastResetDoc.empty) {
        const userSettings = lastResetDoc.docs[0].data();
        const lastReset = userSettings.lastCounterReset;
        
        if (lastReset !== today) {
          // Prima salvare i valori dei contatori giornalieri
          await saveCounterEntries();
          // Poi resettare i contatori
          await resetDailyCounters();
          await updateDoc(lastResetDoc.docs[0].ref, { lastCounterReset: today });
        }
      } else {
        // Create settings document if it doesn't exist
        await addDoc(collection(db, 'userSettings'), {
          userId: currentUser.uid,
          lastCounterReset: today
        });
      }
    };
    
    checkAndResetCounters();
    
    // Imposta un timer per verificare il reset dei contatori alla mezzanotte
    const setMidnightCheck = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const timeToMidnight = midnight.getTime() - now.getTime();
      
      setTimeout(() => {
        checkAndResetCounters();
        setMidnightCheck(); // Reimpostazione per il giorno successivo
      }, timeToMidnight);
    };
    
    setMidnightCheck();
    
    // Richiedi permesso per le notifiche
    const requestNotificationPermission = async () => {
      await notificationService.requestPermission();
    };
    
    requestNotificationPermission();
    
    setIsLoading(false);
    
    return () => {
      unsubscribeTasks();
      unsubscribeCounters();
      notificationService.clearAllNotifications();
    };
  }, [currentUser]);

  const addTask = async (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    if (!currentUser) return;
    
    // Crea una copia dei dati e rimuovi tutti i campi undefined
    const cleanedData: Record<string, any> = {};
    
    // Aggiungi solo i campi che hanno un valore definito
    Object.entries(taskData).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanedData[key] = value;
      }
    });
    
    const newTask = {
      ...cleanedData,
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
    const newIsCompleted = !taskToToggle.isCompleted;
    
    await updateDoc(taskRef, {
      isCompleted: newIsCompleted
    });
    
    // Se il task è stato completato, cancella le sue notifiche
    if (newIsCompleted && taskToToggle.notifyBefore) {
      notificationService.clearTaskNotification(taskId);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!currentUser) return;
    
    // Rimuovi le notifiche per questo task
    notificationService.clearTaskNotification(taskId);
    
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
      createdAt: new Date(),
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

  const saveCounterEntries = async () => {
    if (!currentUser) return;
    
    // Usa il servizio per salvare i valori attuali dei contatori
    await CounterEntriesService.saveCounterEntries(counters, currentUser.uid);
  };

  const resetDailyCounters = async () => {
    if (!currentUser) return;
  
    const today = format(new Date(), 'yyyy-MM-dd');
    const dailyCounters = counters.filter(
      (counter) =>
        counter.type === 'daily' &&
        counter.startDate <= today &&
        (!counter.endDate || counter.endDate >= today)
    );
  
    for (const counter of dailyCounters) {
      const counterRef = doc(db, 'counters', counter.id);
      await updateDoc(counterRef, { currentValue: 0 });
    }
    
    // Ricarica le voci storiche dopo il reset
    const entries = await CounterEntriesService.getAllCounterEntries(currentUser.uid);
    setCounterEntries(entries);
  };

  const resetAllData = async () => {
    if (!currentUser) return;
    
    // Cancella tutte le notifiche
    notificationService.clearAllNotifications();
    
    // Delete all tasks
    for (const task of tasks) {
      await deleteDoc(doc(db, 'tasks', task.id));
    }
    
    // Delete all counters
    for (const counter of counters) {
      await deleteDoc(doc(db, 'counters', counter.id));
    }
  };
  
  const getCounterHistory = async (counterId: string): Promise<CounterEntry[]> => {
    if (!currentUser) return [];
    
    return await CounterEntriesService.getCounterEntriesById(counterId, currentUser.uid);
  };

  const value = {
    tasks,
    counters,
    counterEntries,
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
    deleteRoutineOccurrence,
    getCounterHistory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};