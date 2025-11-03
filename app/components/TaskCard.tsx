import { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Circle, Edit2, Trash2, Calendar, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  animationDelay?: number;
}

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  animationDelay = 0,
}: TaskCardProps) {
  return (
    <div
      className="rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-md transition-all duration-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
        <button
          onClick={onToggle}
          className="mt-1 flex-shrink-0 transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed ? (
            <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
          ) : (
            <Circle className="h-6 w-6 sm:h-7 sm:w-7 text-slate-300 hover:text-blue-500" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h4
                className={cn(
                  "mb-1 sm:mb-2 text-sm sm:text-base font-bold break-words",
                  task.completed
                    ? "text-slate-400 line-through"
                    : "text-slate-900 dark:text-white"
                )}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 break-words">
                  {task.description}
                </p>
              )}
              <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {formatDate(task.createdAt)}
              </p>
            </div>
            {task.completed && (
              <span className="flex-shrink-0 rounded-full bg-green-100 px-2 py-1 sm:px-3 sm:py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400 self-start">
                <CheckCircle className="mr-1 inline h-3 w-3" aria-hidden="true" />
                Done
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-1 sm:gap-2">
          <button
            onClick={onEdit}
            className="rounded-lg p-1.5 sm:p-2 text-blue-600 transition-all hover:scale-110 hover:bg-blue-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-900/20"
            aria-label="Edit task"
          >
            <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 sm:p-2 text-red-600 transition-all hover:scale-110 hover:bg-red-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:hover:bg-red-900/20"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

