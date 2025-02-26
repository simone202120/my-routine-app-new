// src/utils/taskUtils.ts
import { format } from 'date-fns';
import { Task } from '../types';

/**
 * Verifica se un task è programmato per una data specifica,
 * considerando tipo di ricorrenza, giorni della settimana e intervalli
 */
export function isTaskScheduledForDate(task: Task, date: Date): boolean {
  if (task.type !== 'routine') {
    return false; // Gestisce solo task ricorrenti
  }

  // Controlla se è escluso specificamente
  const dateStr = format(date, 'yyyy-MM-dd');
  if (task.excludedDates?.includes(dateStr)) {
    return false;
  }

  // Controlla se è al di fuori dell'intervallo di date
  if (task.startDate && dateStr < task.startDate) {
    return false;
  }
  if (task.endDate && dateStr > task.endDate) {
    return false;
  }

  // Verifica se il giorno della settimana è pianificato
  const dayOfWeek = format(date, 'eee').toLowerCase();
  const isScheduledWeekday = task.weekdays?.includes(dayOfWeek) ?? false;
  
  // Se non è nei giorni pianificati, esci subito
  if (!isScheduledWeekday) {
    return false;
  }

  // Se il giorno della settimana è corretto, verifica la ricorrenza
  if (!task.startDate) {
    return true; // Se non c'è data di inizio, mostra sempre nei giorni selezionati
  }

  const startDate = new Date(task.startDate);

  if (task.recurrenceType === 'weekly' || !task.recurrenceType) {
    // Se è settimanale o non specificato, mostra sempre nei giorni selezionati
    return true;
  } 
  else if (task.recurrenceType === 'biweekly') {
    // Calcola quante settimane sono passate dalla data di inizio
    const diffTime = date.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    
    // Mostra solo nelle settimane pari a partire dalla settimana di inizio (0, 2, 4, ...)
    return diffWeeks % 2 === 0;
  } 
  else if (task.recurrenceType === 'monthly') {
    // Controlla se è lo stesso giorno del mese della data di inizio
    return date.getDate() === startDate.getDate();
  } 
  else if (task.recurrenceType === 'custom' && task.recurrenceInterval) {
    // Per ricorrenze personalizzate, calcola in base all'intervallo in giorni
    const diffTime = date.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Verifica se sono passati multipli esatti dell'intervallo
    return diffDays % task.recurrenceInterval === 0;
  }

  return false;
}