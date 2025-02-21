// pages/CalendarPage.tsx
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "../components/ui/button";
import TaskItem from '../components/tasks/TaskItem';
import { useApp } from '../context/AppContext';

const CalendarPage = () => {
  const { tasks, toggleTaskComplete } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Ottiene tutti i giorni del mese corrente
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // Gestisce il cambio mese
  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Filtra i task per la data selezionata
  const selectedDateTasks = tasks.filter(task => {
    if (task.type === 'routine') return true;
    return task.date === format(selectedDate, 'yyyy-MM-dd');
  });

  // Verifica se un giorno ha dei task
  const hasTasksOnDate = (date: Date) => {
    return tasks.some(task => {
      if (task.type === 'routine') return true;
      return task.date === format(date, 'yyyy-MM-dd');
    });
  };

  return (
    <div className="pb-20 pt-16">
      {/* Header del calendario */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {format(currentDate, 'MMMM yyyy', { locale: it })}
          </h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Griglia dei giorni della settimana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Griglia dei giorni del mese */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map(day => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const hasEvents = hasTasksOnDate(day);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  p-2 h-14 text-sm rounded-lg
                  ${isSelected ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}
                  ${!isCurrentMonth && 'text-gray-400'}
                  relative
                `}
              >
                <span className={`
                  ${isSelected ? 'font-bold' : ''}
                  ${hasEvents ? 'text-primary-600' : ''}
                `}>
                  {format(day, 'd')}
                </span>
                {hasEvents && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista degli impegni per il giorno selezionato */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">
          Impegni del {format(selectedDate, 'd MMMM yyyy', { locale: it })}
        </h2>
        <div className="space-y-3">
          {selectedDateTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={toggleTaskComplete}
            />
          ))}
          {selectedDateTasks.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nessun impegno per questa data
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;