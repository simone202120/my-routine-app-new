// components/tasks/TaskItem.tsx - Aggiornato per supportare il completamento di singole occorrenze
import React, { useState } from 'react';
import { Check, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "../ui/button";
import { Task } from '../../types';
import DeleteTaskDialog from './DeleteTaskDialog';
import { isTaskCompletedForDate } from '../../utils/TaskUtils';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string, date?: string) => void;
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
  const [expanded, setExpanded] = useState(false);

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

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Determina se il task è completato per la data corrente
  const isCompleted = task.type === 'oneTime' 
    ? task.isCompleted 
    : isTaskCompletedForDate(task, currentDate);

  // Verifica se c'è una descrizione e se dovremmo mostrare il pulsante per espanderla
  const hasDescription = task.description && task.description.trim().length > 0;

  const handleComplete = () => {
    if (task.type === 'routine') {
      // Per le routine, passa anche la data corrente
      onComplete(task.id, currentDate);
    } else {
      // Per eventi una tantum, mantieni il comportamento esistente
      onComplete(task.id);
    }
  };

  return (
    <>
      <div className={`
        bg-white rounded-xl p-4 shadow-sm border border-gray-100
        ${isCompleted ? 'bg-gray-50' : ''}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium ${
                isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              <div className="flex items-center space-x-2 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-gray-400 ${isCompleted ? 'text-primary-500' : 'hover:text-primary-500'} transition-colors`}
                  onClick={handleComplete}
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
            
            {task.time && (
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>{task.time}</span>
                {task.frequency && (
                  <span className="ml-2">• {task.frequency}</span>
                )}
              </div>
            )}
            
            {hasDescription && (
              <div>
                <div 
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700 cursor-pointer mt-1"
                  onClick={toggleExpand}
                >
                  <span className="mr-1">
                    {expanded ? 'Nascondi dettagli' : 'Mostra dettagli'}
                  </span>
                  {expanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </div>
                
                {expanded && (
                  <div className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded-md">
                    {task.description}
                  </div>
                )}
              </div>
            )}
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