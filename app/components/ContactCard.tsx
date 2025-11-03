import { Contact } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { User, Mail, Building2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
  animationDelay?: number;
}

export function ContactCard({
  contact,
  isSelected,
  onClick,
  animationDelay = 0,
}: ContactCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "transform cursor-pointer rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4 md:p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]",
        isSelected
          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg ring-2 ring-blue-200 dark:from-blue-950/50 dark:to-blue-900/30"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800"
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      role="button"
      tabIndex={0}
      aria-label={`Select contact ${contact.name}`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
        <div className="flex flex-1 items-start gap-2 sm:gap-3 md:gap-4 min-w-0">
          <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2 sm:p-2.5 md:p-3 shadow-md flex-shrink-0">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {contact.name}
            </h3>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{contact.email}</span>
              </p>
              {contact.company && (
                <p className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-500">
                  <Building2
                    className="h-3 w-3 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">{contact.company}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 text-right hidden sm:block">
          <p className="flex items-center gap-1.5 text-xs whitespace-nowrap text-slate-500 dark:text-slate-500">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatDate(contact.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

