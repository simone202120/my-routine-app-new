// components/tasks/TaskItem.tsx
import React from 'react';
import { Check, Clock } from 'lucide-react';
import { Button } from "../ui/button";
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete }) => {
  return (
    <div className={`
      bg-white rounded-xl p-4 shadow-sm border border-gray-100
      ${task.isCompleted ? 'bg-gray-50' : ''}
    `}>
      <div className="flex items-center space-x-4">
        <Button
          variant={task.isCompleted ? "outline" : "default"}
          size="icon"
          className="rounded-full shrink-0"
          onClick={() => onComplete(task.id)}
        >
          <Check className={`h-4 w-4 ${
            task.isCompleted ? 'text-green-500' : 'text-white'
          }`} />
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${
            task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          {task.time && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>{task.time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;