// components/tasks/TaskForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "../ui/button";
import { TaskType } from '../../types';

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    type: TaskType;
    time?: string;
    date?: string;
  }) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSubmit }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    type: 'routine' as TaskType,
    time: '',
    date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Nuovo Impegno</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
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
                type: e.target.value as TaskType
              })}
            >
              <option value="routine">Routine</option>
              <option value="oneTime">Una tantum</option>
            </select>
          </div>
          {taskData.type === 'routine' ? (
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
          ) : (
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
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit">
              Salva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;