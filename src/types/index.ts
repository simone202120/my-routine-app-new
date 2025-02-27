// src/types/index.ts - Aggiunto supporto per notifiche personalizzate
// Aggiungi o modifica queste definizioni nel file

// Tipi per gli impegni
export type TaskType = 'routine' | 'oneTime';

// Tipi di cadenza per le routine
export type RecurrenceType = 'weekly' | 'biweekly' | 'monthly' | 'custom';

// Tipi di unità di tempo per ricorrenze personalizzate
export type TimeUnit = 'days' | 'weeks' | 'months';

// Tipi di unità di tempo per le notifiche
export type NotificationTimeUnit = 'minutes' | 'hours';

// Estendi l'interfaccia Task se necessario
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
  notifyBefore?: boolean;
  notifyInAdvance?: number; // Quanti minuti/ore prima dell'evento
  notifyTimeUnit?: NotificationTimeUnit; // 'minutes' o 'hours'
  recurrenceType?: RecurrenceType;
  recurrenceInterval?: number;
  recurrenceUnit?: TimeUnit; // Proprietà per l'interfaccia locale del form
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