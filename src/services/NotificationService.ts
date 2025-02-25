// src/services/NotificationService.ts
import { Task } from '../types';

class NotificationService {
  private static instance: NotificationService;
  private notificationsEnabled: boolean = false;
  private tasks: Task[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();
  
  private constructor() {
    // Singleton pattern
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Verifica e richiede i permessi per le notifiche
   */
  public async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("Questo browser non supporta le notifiche desktop");
      return false;
    }

    if (Notification.permission === "granted") {
      this.notificationsEnabled = true;
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      this.notificationsEnabled = permission === "granted";
      return this.notificationsEnabled;
    }

    return false;
  }

  /**
   * Controlla se le notifiche sono abilitate
   */
  public areNotificationsEnabled(): boolean {
    return this.notificationsEnabled && Notification.permission === "granted";
  }

  /**
   * Aggiorna la lista dei task e imposta i timer per le notifiche
   */
  public updateTasks(tasks: Task[]): void {
    this.clearAllNotifications(); // Rimuovi tutti i timer esistenti
    this.tasks = tasks;
    
    if (!this.notificationsEnabled) return;
    
    // Imposta i nuovi timer solo per i task che devono essere notificati
    const now = new Date();
    
    tasks.forEach(task => {
      if (!task.notifyBefore || task.isCompleted) return;
      
      if (task.type === 'oneTime') {
        this.scheduleOneTimeNotification(task);
      } else if (task.type === 'routine') {
        this.scheduleRoutineNotifications(task);
      }
    });
  }

  /**
   * Pianifica una notifica per un task una tantum
   */
  private scheduleOneTimeNotification(task: Task): void {
    if (!task.date || !task.time) return;
    
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    const notificationTime = new Date(taskDateTime.getTime() - 10 * 60 * 1000); // 10 minuti prima
    
    const now = new Date();
    if (notificationTime <= now) return; // Non programmare notifiche nel passato
    
    const timeToNotification = notificationTime.getTime() - now.getTime();
    
    const timerId = setTimeout(() => {
      this.showNotification(task);
    }, timeToNotification);
    
    this.timers.set(task.id, timerId);
  }

  /**
   * Pianifica notifiche per un task ricorrente
   */
  private scheduleRoutineNotifications(task: Task): void {
    if (!task.time || !task.weekdays || task.weekdays.length === 0) return;
    
    const now = new Date();
    const today = now.getDay(); // 0 = Domenica, 1 = Lunedì, ...
    const daysMap: {[key: string]: number} = {
      'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6, 'sun': 0
    };
    
    // Trova il prossimo giorno in cui il task è programmato
    let daysToAdd = 7; // Valore di default (una settimana)
    
    task.weekdays.forEach(weekday => {
      const weekdayNum = daysMap[weekday];
      let daysUntilNextOccurrence = (weekdayNum - today + 7) % 7;
      if (daysUntilNextOccurrence === 0) {
        // Oggi è il giorno programmato, verifica l'ora
        const [hours, minutes] = task.time!.split(':').map(Number);
        const taskTimeToday = new Date();
        taskTimeToday.setHours(hours, minutes, 0);
        
        // Se l'ora è già passata, considera la prossima settimana
        if (taskTimeToday <= now) {
          daysUntilNextOccurrence = 7;
        }
      }
      
      if (daysUntilNextOccurrence < daysToAdd) {
        daysToAdd = daysUntilNextOccurrence;
      }
    });
    
    // Calcola la data/ora esatta della prossima occorrenza
    const nextOccurrence = new Date();
    nextOccurrence.setDate(nextOccurrence.getDate() + daysToAdd);
    
    // Imposta l'ora
    const [hours, minutes] = task.time.split(':').map(Number);
    nextOccurrence.setHours(hours, minutes, 0, 0);
    
    // Calcola il tempo per la notifica (10 minuti prima)
    const notificationTime = new Date(nextOccurrence.getTime() - 10 * 60 * 1000);
    const timeToNotification = notificationTime.getTime() - now.getTime();
    
    if (timeToNotification > 0) {
      const timerId = setTimeout(() => {
        this.showNotification(task);
        // Dopo aver mostrato la notifica, pianifica la prossima
        this.scheduleRoutineNotifications(task);
      }, timeToNotification);
      
      this.timers.set(`${task.id}_${nextOccurrence.toISOString()}`, timerId);
    }
  }

  /**
   * Mostra una notifica per un task
   */
  private showNotification(task: Task): void {
    if (!this.notificationsEnabled) return;
    
    const title = "Promemoria Impegno";
    const options = {
      body: `Tra 10 minuti: ${task.title}`,
      icon: '/logo192.png',
    };
    
    const notification = new Notification(title, options);
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  /**
   * Cancella tutti i timer delle notifiche
   */
  public clearAllNotifications(): void {
    this.timers.forEach(timerId => {
      clearTimeout(timerId);
    });
    this.timers.clear();
  }

  /**
   * Cancella le notifiche per un singolo task
   */
  public clearTaskNotification(taskId: string): void {
    this.timers.forEach((timerId, key) => {
      if (key === taskId || key.startsWith(`${taskId}_`)) {
        clearTimeout(timerId);
        this.timers.delete(key);
      }
    });
  }
}

export default NotificationService;