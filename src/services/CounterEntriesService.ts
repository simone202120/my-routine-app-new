// src/services/CounterEntriesService.ts
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    Timestamp,
    DocumentData
  } from 'firebase/firestore';
  import { db } from '../firebase/config';
  import { Counter, CounterEntry } from '../types';
  import { format } from 'date-fns';
  
  export class CounterEntriesService {
    /**
     * Salva i valori correnti dei contatori giornalieri come voci storiche
     * @param counters Lista dei contatori giornalieri
     * @param userId ID dell'utente
     */
    static async saveCounterEntries(counters: Counter[], userId: string): Promise<void> {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Filtra solo i contatori giornalieri attivi
      const dailyCounters = counters.filter(
        (counter) =>
          counter.type === 'daily' &&
          counter.startDate <= today &&
          (!counter.endDate || counter.endDate >= today)
      );
      
      // Salva ogni contatore come voce storica
      for (const counter of dailyCounters) {
        try {
          await addDoc(collection(db, 'counterEntries'), {
            counterId: counter.id,
            userId: userId,
            date: today,
            value: counter.currentValue,
            name: counter.name,
            timestamp: Timestamp.now()
          });
        } catch (error) {
          console.error(`Errore nel salvare la voce storica per il contatore ${counter.id}:`, error);
        }
      }
    }
  
    /**
     * Recupera le voci storiche per tutti i contatori di un utente
     * @param userId ID dell'utente
     */
    static async getAllCounterEntries(userId: string): Promise<CounterEntry[]> {
      try {
        const entriesQuery = query(
          collection(db, 'counterEntries'),
          where('userId', '==', userId),
          orderBy('date', 'desc')
        );
        
        const snapshot = await getDocs(entriesQuery);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CounterEntry));
      } catch (error) {
        console.error('Errore nel recuperare le voci storiche dei contatori:', error);
        return [];
      }
    }
  
    /**
     * Recupera le voci storiche per un contatore specifico
     * @param counterId ID del contatore
     * @param userId ID dell'utente
     */
    static async getCounterEntriesById(counterId: string, userId: string): Promise<CounterEntry[]> {
      try {
        const entriesQuery = query(
          collection(db, 'counterEntries'),
          where('counterId', '==', counterId),
          where('userId', '==', userId),
          orderBy('date', 'desc')
        );
        
        const snapshot = await getDocs(entriesQuery);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CounterEntry));
      } catch (error) {
        console.error(`Errore nel recuperare le voci storiche per il contatore ${counterId}:`, error);
        return [];
      }
    }
    
    /**
     * Verifica se esistono voci storiche per una data specifica
     * @param date Data da verificare (formato yyyy-MM-dd)
     * @param userId ID dell'utente
     */
    static async hasEntriesForDate(date: string, userId: string): Promise<boolean> {
      try {
        const entriesQuery = query(
          collection(db, 'counterEntries'),
          where('userId', '==', userId),
          where('date', '==', date)
        );
        
        const snapshot = await getDocs(entriesQuery);
        return !snapshot.empty;
      } catch (error) {
        console.error(`Errore nel verificare le voci storiche per la data ${date}:`, error);
        return false;
      }
    }
    
    /**
     * Recupera le statistiche di un contatore nel tempo
     * @param counterId ID del contatore
     * @param userId ID dell'utente
     * @param days Numero di giorni precedenti da considerare (default: 7)
     */
    static async getCounterStats(counterId: string, userId: string, days: number = 7): Promise<any> {
      const entries = await this.getCounterEntriesById(counterId, userId);
      
      // Limitiamo agli ultimi 'days' giorni
      const limitedEntries = entries.slice(0, days);
      
      if (limitedEntries.length === 0) {
        return {
          averageValue: 0,
          maxValue: 0,
          minValue: 0,
          totalValue: 0,
          entries: []
        };
      }
      
      const values = limitedEntries.map(entry => entry.value);
      const totalValue = values.reduce((sum, value) => sum + value, 0);
      
      return {
        averageValue: totalValue / values.length,
        maxValue: Math.max(...values),
        minValue: Math.min(...values),
        totalValue,
        entries: limitedEntries
      };
    }
  }