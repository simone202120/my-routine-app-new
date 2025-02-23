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
}

// Tipi per i contatori
export type CounterType = 'daily' | 'total';

export interface Counter {
  id: string;
  name: string;
  type: CounterType;
  currentValue: number;
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