// Tipi per gli impegni
// Tipi per gli impegni
export type TaskType = 'routine' | 'oneTime';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  date?: string;
  time?: string;
  weekdays?: string[];
  startDate?: string;
  endDate?: string;
  isCompleted: boolean;
  frequency?: string;
  excludedDates?: string[];
  notifyBefore?: boolean; // Flag per le notifiche prima del task
}

// Tipi per i contatori
export type CounterType = 'daily' | 'total';

export interface Counter {
  id: string;
  name: string;
  type: CounterType;
  currentValue: number;
  startDate: string;
  endDate?: string;
  duration: 'day' | 'custom';
}

// Voci storiche per i contatori
export interface CounterEntry {
  id: string;
  counterId: string;
  userId: string;
  date: string;
  value: number;
  name?: string;
  timestamp?: any; // Timestamp di Firestore
}
// types/index.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  date?: string;
  time?: string;
  weekdays?: string[]; // Aggiungiamo questa proprietà
  isCompleted: boolean;
}