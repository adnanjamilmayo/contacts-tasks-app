import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  ariaLabel = "Search",
}: SearchBarProps) {
  return (
    <div className="group relative">
      <Search
        className="absolute top-1/2 left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pr-10 sm:pr-4 sm:pl-12 pl-10 sm:py-4 text-sm sm:text-base shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
        aria-label={ariaLabel}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1 dark:hover:text-slate-300"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

