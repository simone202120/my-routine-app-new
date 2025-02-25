// components/tasks/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import { X, Bell, BellOff } from 'lucide-react';
import { Button } from "../ui/button";
import { TaskType } from '../../types';
import { addWeeks, addMonths, addYears, format } from 'date-fns';
import NotificationService from '../../services/NotificationService';

const WEEKDAYS = [
  { id: 'mon', label: 'Lun' },
  { id: 'tue', label: 'Mar' },
  { id: 'wed', label: 'Mer' },
  { id: 'thu', label: 'Gio' },
  { id: 'fri', label: 'Ven' },
  { id: 'sat', label: 'Sab' },
  { id: 'sun', label: 'Dom' }
];

const DURATION_TYPES = [
  { id: 'custom', label: 'Personalizzata' },
  { id: 'oneWeek', label: '1 Settimana' },
  { id: 'twoWeek', label: '2 Settimana' },
  { id: 'threeWeek', label: '3 Settimana' },
  { id: 'oneMonth', label: '1 Mese' },
  { id: 'twoMonth', label: '2 Mese' },
  { id: 'threeMonths', label: '3 Mesi' },
  { id: 'sixMonths', label: '6 Mesi' },
  { id: 'oneYear', label: '1 Anno' }
];

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    type: TaskType;
    time?: string;
    date?: string;
    weekdays?: string[];
    startDate?: string;
    endDate?: string;
    notifyBefore?: boolean;
  }) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSubmit }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    type: 'routine' as TaskType,
    time: '',
    date: '',
    weekdays: [] as string[],
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    durationType: 'custom',
    notifyBefore: false
  });
  
  const [notificationsAvailable, setNotificationsAvailable] = useState(false);
  
  useEffect(() => {
    const checkNotificationPermission = async () => {
      const notificationService = NotificationService.getInstance();
      const isEnabled = await notificationService.requestPermission();
      setNotificationsAvailable(isEnabled);
    };
    
    checkNotificationPermission();
  }, []);

  const toggleWeekday = (dayId: string) => {
    setTaskData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(dayId)
        ? prev.weekdays.filter(d => d !== dayId)
        : [...prev.weekdays, dayId]
    }));
  };

  const handleDurationTypeChange = (durationType: string) => {
    const startDate = new Date(taskData.startDate);
    let endDate = startDate;

    switch (durationType) {
      case 'oneWeek':
        endDate = addWeeks(startDate, 1);
        break;
      case 'twoWeek':
        endDate = addWeeks(startDate, 2);
        break;
      case 'threeWeek':
        endDate = addWeeks(startDate, 3);
        break;
      case 'oneMonth':
        endDate = addMonths(startDate, 1);
        break;
      case 'twoMonth':
        endDate = addMonths(startDate, 2);
        break;
      case 'threeMonths':
        endDate = addMonths(startDate, 3);
        break;
      case 'sixMonths':
        endDate = addMonths(startDate, 6);
        break;
      case 'oneYear':
        endDate = addYears(startDate, 1);
        break;
    }

    setTaskData(prev => ({
      ...prev,
      durationType,
      endDate: durationType === 'custom' ? prev.endDate : format(endDate, 'yyyy-MM-dd')
    }));
  };

  const toggleNotification = () => {
    setTaskData(prev => ({
      ...prev,
      notifyBefore: !prev.notifyBefore
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: taskData.title,
      type: taskData.type,
      time: taskData.time,
      date: taskData.type === 'oneTime' ? taskData.date : undefined,
      weekdays: taskData.type === 'routine' ? taskData.weekdays : [], // Usa array vuoto invece di undefined
      startDate: taskData.type === 'routine' ? taskData.startDate : undefined,
      endDate: taskData.type === 'routine' ? taskData.endDate : undefined,
      notifyBefore: taskData.notifyBefore
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 pb-24">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[75vh] flex flex-col relative top-[-3rem]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Nuovo Impegno</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4">
          <form id="taskForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titolo
              </label>
              <input
                type="text"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={taskData.type}
                onChange={(e) => setTaskData({
                  ...taskData, 
                  type: e.target.value as TaskType,
                  weekdays: []
                })}
              >
                <option value="routine">Routine</option>
                <option value="oneTime">Una tantum</option>
              </select>
            </div>

            {taskData.type === 'routine' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orario
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={taskData.time}
                    onChange={(e) => setTaskData({...taskData, time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giorni
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map(day => (
                      <button
                        key={day.id}
                        type="button"
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          taskData.weekdays.includes(day.id)
                            ? 'bg-primary-100 border-primary-500 text-primary-700'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => toggleWeekday(day.id)}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Inizio
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={taskData.startDate}
                    onChange={(e) => setTaskData({...taskData, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durata
                  </label>
                  <select
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mb-2"
                    value={taskData.durationType}
                    onChange={(e) => handleDurationTypeChange(e.target.value)}
                  >
                    {DURATION_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  
                  {taskData.durationType === 'custom' && (
                    <input
                      type="date"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={taskData.endDate}
                      min={taskData.startDate}
                      onChange={(e) => setTaskData({...taskData, endDate: e.target.value})}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={taskData.date}
                    onChange={(e) => setTaskData({...taskData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orario
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={taskData.time}
                    onChange={(e) => setTaskData({...taskData, time: e.target.value})}
                  />
                </div>
              </>
            )}
            
            {/* Opzione per le notifiche */}
            {notificationsAvailable && (
              <div className="flex items-center justify-between px-2 py-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Notifica</p>
                  <p className="text-sm text-gray-500">Ricevi un avviso 10 minuti prima</p>
                </div>
                <Button
                  type="button"
                  variant={taskData.notifyBefore ? "default" : "outline"}
                  className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
                  onClick={toggleNotification}
                >
                  {taskData.notifyBefore ? (
                    <Bell className="h-5 w-5" />
                  ) : (
                    <BellOff className="h-5 w-5" />
                  )}
                </Button>
              </div>
            )}
            
            {/* Messaggio di notifica disabilitata */}
            {!notificationsAvailable && taskData.time && (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                Per ricevere notifiche per questo impegno, abilita i permessi per le notifiche nel tuo browser.
              </div>
            )}
          </form>
        </div>

        <div className="border-t p-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Annulla
            </Button>
            <Button 
              type="submit"
              form="taskForm"
              disabled={
                taskData.type === 'routine' && 
                (taskData.weekdays.length === 0 || 
                !taskData.startDate || 
                (taskData.durationType === 'custom' && !taskData.endDate))
              }
            >
              Salva
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;