import { Task } from "@/lib/types";
import { Edit2, X, Loader2 } from "lucide-react";

interface TaskFormProps {
  editingTask: Task | null;
  taskTitle: string;
  taskDescription: string;
  submitting: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function TaskForm({
  editingTask,
  taskTitle,
  taskDescription,
  submitting,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onClose,
}: TaskFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="animate-in slide-in-from-top-5 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {editingTask ? (
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Edit2 className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              <span>Edit Task</span>
            </span>
          ) : (
            "New Task"
          )}
        </h3>
        <button
          onClick={onClose}
          disabled={submitting}
          className="rounded-lg p-1.5 sm:p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:hover:bg-slate-700 flex-shrink-0"
          aria-label="Close form"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label
            htmlFor="task-title"
            className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            Title *
          </label>
          <input
            id="task-title"
            type="text"
            value={taskTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="Enter task title"
            required
            aria-required="true"
            aria-invalid={!taskTitle.trim()}
          />
        </div>
        <div>
          <label
            htmlFor="task-description"
            className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={taskDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            disabled={submitting}
            rows={3}
            className="w-full resize-none rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="Enter task description (optional)"
            aria-label="Task description (optional)"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !taskTitle.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" aria-hidden="true" />
              Processing...
            </span>
          ) : editingTask ? (
            "Update Task"
          ) : (
            "Create Task"
          )}
        </button>
      </form>
    </div>
  );
}

