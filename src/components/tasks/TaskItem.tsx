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
    <div className={`p-4 rounded-lg border ${
      task.isCompleted ? 'bg-gray-50' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant={task.isCompleted ? "outline" : "default"}
            size="icon"
            onClick={() => onComplete(task.id)}
          >
            <Check className={`h-4 w-4 ${
              task.isCompleted ? 'text-green-500' : 'text-white'
            }`} />
          </Button>
          <div>
            <h3 className={`font-medium ${
              task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>{task.title}</h3>
            {task.time && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{task.time}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;