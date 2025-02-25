// components/tasks/TaskItem.tsx
import React, { useState } from 'react';
import { Check, Clock, Trash2 } from 'lucide-react';
import { Button } from "../ui/button";
import { Task } from '../../types';
import DeleteTaskDialog from './DeleteTaskDialog';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteSingleOccurrence: (taskId: string, date: string) => void;
  currentDate: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onComplete, 
  onDelete,
  onDeleteSingleOccurrence,
  currentDate 
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteSingle = () => {
    if (task.type === 'routine') {
      onDeleteSingleOccurrence(task.id, currentDate);
    } else {
      onDelete(task.id);
    }
    setShowDeleteDialog(false);
  };

  const handleDeleteAll = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className={`
        bg-white rounded-xl p-4 shadow-sm border border-gray-100
        ${task.isCompleted ? 'bg-gray-50' : ''}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium truncate ${
              task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {task.description}
              </p>
            )}
            {task.time && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>{task.time}</span>
                {task.frequency && (
                  <span className="ml-2">• {task.frequency}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className={`text-gray-400 ${task.isCompleted ? 'text-primary-500' : 'hover:text-primary-500'} transition-colors`}
              onClick={() => onComplete(task.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <DeleteTaskDialog
        isOpen={showDeleteDialog}
        isRoutine={task.type === 'routine'}
        onClose={() => setShowDeleteDialog(false)}
        onDeleteSingle={handleDeleteSingle}
        onDeleteAll={handleDeleteAll}
      />
    </>
  );
};

export default TaskItem;