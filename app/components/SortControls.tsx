import { SortField, SortDirection } from "@/lib/types";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortControlsProps {
  sortBy: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export function SortControls({
  sortBy,
  sortDirection,
  onSortChange,
}: SortControlsProps) {
  const handleSortClick = (field: SortField) => {
    if (sortBy === field) {
      onSortChange(field, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-4 w-4 text-slate-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  };

  const sortFields: { field: SortField; label: string }[] = [
    { field: "name", label: "Name" },
    { field: "email", label: "Email" },
    { field: "company", label: "Company" },
    { field: "createdAt", label: "Date" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Sort by:
      </span>
      {sortFields.map(({ field, label }) => (
        <button
          key={field}
          onClick={() => handleSortClick(field)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            sortBy === field
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-300"
              : "border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          )}
          aria-label={`Sort by ${label} ${sortBy === field ? `(${sortDirection})` : ""}`}
          aria-pressed={sortBy === field}
        >
          {getSortIcon(field)}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

