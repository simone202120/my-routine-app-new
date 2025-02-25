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
  frequency?: string;  // Aggiungiamo questa riga
  excludedDates?: string[];  // Aggiungi questa riga
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

export interface CounterEntry {
  id: string;
  counterId: string;
  date: string;
  value: number;
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