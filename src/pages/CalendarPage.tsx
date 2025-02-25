// pages/CalendarPage.tsx
import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  isToday,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "../components/ui/button";
import TaskItem from '../components/tasks/TaskItem';
import { useApp } from '../context/AppContext';

const CalendarPage = () => {
  const { 
    tasks, 
    toggleTaskComplete, 
    deleteTask,
    deleteRoutineOccurrence 
  } = useApp();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const monthDays = getDaysInMonth(currentDate);

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const selectedDateTasks = tasks.filter(task => {
    if (task.type === 'oneTime') {
      return task.date === selectedDateStr;
    }
    if (task.type === 'routine') {
      const dayOfWeek = format(selectedDate, 'eee').toLowerCase();
      const isScheduledDay = task.weekdays?.includes(dayOfWeek) ?? false;
      const isExcluded = task.excludedDates?.includes(selectedDateStr) ?? false;
      
      // Controlla che la data selezionata sia nel range della routine
      const isAfterStart = task.startDate ? selectedDateStr >= task.startDate : true;
      const isBeforeEnd = task.endDate ? selectedDateStr <= task.endDate : true;
      
      return isScheduledDay && isAfterStart && isBeforeEnd && !isExcluded;
    }
    return false;
  });

  const hasTasksOnDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.some(task => {
      if (task.type === 'oneTime') {
        return task.date === dateStr;
      }
      if (task.type === 'routine') {
        const dayOfWeek = format(date, 'eee').toLowerCase();
        const isScheduledDay = task.weekdays?.includes(dayOfWeek) ?? false;
        const isExcluded = task.excludedDates?.includes(dateStr) ?? false;
        
        // Controlla che la data sia nel range della routine
        const isAfterStart = task.startDate ? dateStr >= task.startDate : true;
        const isBeforeEnd = task.endDate ? dateStr <= task.endDate : true;
        
        return isScheduledDay && isAfterStart && isBeforeEnd && !isExcluded;
      }
      return false;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: it })}
          </h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Giorni della settimana */}
        <div className="grid grid-cols-7 mb-2">
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Griglia dei giorni */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map(day => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const hasEvents = hasTasksOnDate(day);
            const isDayToday = isToday(day);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square p-1 relative flex flex-col items-center justify-center
                  rounded-lg transition-colors
                  ${!isCurrentMonth && 'text-gray-400'}
                  ${isSelected ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-50'}
                  ${isDayToday && !isSelected && 'border-2 border-primary-500'}
                `}
              >
                <span className={`
                  text-sm font-medium
                  ${isSelected && 'font-bold'}
                `}>
                  {format(day, 'd')}
                </span>
                {hasEvents && (
                  <span className={`
                    w-1.5 h-1.5 rounded-full mt-1
                    ${isSelected ? 'bg-primary-600' : 'bg-primary-400'}
                  `} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista degli impegni */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Impegni del {format(selectedDate, 'd MMMM yyyy', { locale: it })}
        </h2>
        <div className="space-y-3">
          {selectedDateTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={toggleTaskComplete}
              onDelete={deleteTask}
              onDeleteSingleOccurrence={deleteRoutineOccurrence}
              currentDate={selectedDateStr}
            />
          ))}
          {selectedDateTasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nessun impegno per questa data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;