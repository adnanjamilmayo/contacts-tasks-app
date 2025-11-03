"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { contactApi, taskApi } from "@/lib/data";
import { Contact, SortField, SortDirection, Task } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { ContactCard } from "./components/ContactCard";
import { TaskCard } from "./components/TaskCard";
import { TaskForm } from "./components/TaskForm";
import { SearchBar } from "./components/SearchBar";
import { SortControls } from "./components/SortControls";
import {
  User,
  Circle,
  Plus,
  AlertCircle,
  Loader2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, SEARCH_DEBOUNCE_MS),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactApi.getAll();
      setContacts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load contacts"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (err) {
    }
  }, []);

  useEffect(() => {
    fetchContacts();
    fetchTasks();
  }, [fetchContacts, fetchTasks]);

  const filteredContacts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return contacts;

    const lowerSearch = debouncedSearchTerm.toLowerCase().trim();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerSearch) ||
        contact.email.toLowerCase().includes(lowerSearch) ||
        contact.company?.toLowerCase().includes(lowerSearch)
    );
  }, [contacts, debouncedSearchTerm]);

  const sortedContacts = useMemo(() => {
    const sorted = [...filteredContacts];

    sorted.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case "createdAt":
        aValue = a.createdAt;
        bValue = b.createdAt;
          break;
        case "name":
        aValue = a.name;
        bValue = b.name;
          break;
        case "email":
        aValue = a.email;
        bValue = b.email;
          break;
        case "company":
        aValue = a.company || "";
        bValue = b.company || "";
          break;
      default:
        return 0;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        const diff = aValue.getTime() - bValue.getTime();
        return sortDirection === "asc" ? diff : -diff;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredContacts, sortBy, sortDirection]);

  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedContacts.slice(startIndex, endIndex);
  }, [sortedContacts, currentPage]);

  const totalPages = Math.max(1, Math.ceil(sortedContacts.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const contactTasks = useMemo(() => {
    if (!selectedContact) return [];
    return tasks.filter((task) => task.contactId === selectedContact.id);
  }, [tasks, selectedContact]);

  const handleSortChange = useCallback((field: SortField, direction: SortDirection) => {
    setSortBy(field);
    setSortDirection(direction);
    setCurrentPage(1);
  }, []);

  const handleToggleTask = useCallback(async (task: Task) => {
    try {
      const updatedTask = await taskApi.update(task.id, {
        completed: !task.completed,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskApi.delete(taskId);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }, []);

  const handleCreateTask = useCallback(async () => {
    if (!selectedContact) {
      setError("No contact selected");
      return;
    }

    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle) {
      setError("Task title is required");
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Task title must be 200 characters or less");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const newTask = await taskApi.create({
        contactId: selectedContact.id,
        title: trimmedTitle,
        description: taskDescription.trim() || undefined,
        completed: false,
      });
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskTitle("");
      setTaskDescription("");
      setShowTaskForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  }, [selectedContact, taskTitle, taskDescription]);

  const handleUpdateTask = useCallback(async () => {
    if (!editingTask) {
      setError("No task selected for editing");
      return;
    }

    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle) {
      setError("Task title is required");
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Task title must be 200 characters or less");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const updatedTask = await taskApi.update(editingTask.id, {
        title: trimmedTitle,
        description: taskDescription.trim() || undefined,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === editingTask.id ? updatedTask : t))
      );
      setTaskTitle("");
      setTaskDescription("");
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setSubmitting(false);
    }
  }, [editingTask, taskTitle, taskDescription]);

  const openEditForm = useCallback((task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setShowTaskForm(true);
    setError(null);
  }, []);

  const closeForm = useCallback(() => {
    setShowTaskForm(false);
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
    setSubmitting(false);
    setError(null);
  }, []);

  const openTaskForm = useCallback(() => {
    setShowTaskForm(true);
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
    setError(null);
  }, []);

  const handleContactSelect = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setShowTaskForm(false);
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-6 md:py-8">
        <header className="mb-6 sm:mb-8 md:mb-10">
          <div className="mb-3 flex items-center gap-2 sm:gap-3">
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-2 sm:p-3 shadow-lg">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent dark:from-white dark:via-blue-200 dark:to-white">
                Contacts & Tasks
              </h1>
              <p className="mt-1 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400">
                Professional contact and task management system
              </p>
            </div>
          </div>
        </header>

        <main id="main-content">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Left Column - Contacts */}
          <div className="space-y-6">
              {/* Search Bar */}
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name, email, or company..."
                ariaLabel="Search contacts"
              />

              {/* Sort Controls */}
              {!loading && !error && contacts.length > 0 && (
                <SortControls
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                />
              )}

            {/* Error State */}
              {error && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="animate-in slide-in-from-top-5 rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 p-4 sm:p-6 shadow-lg dark:border-red-900 dark:from-red-950 dark:to-red-950/50"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <AlertCircle
                      className="mt-0.5 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-red-600"
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 text-sm sm:text-base font-semibold text-red-900 dark:text-red-200">
                        Error
                      </h3>
                      <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 break-words">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={handleClearError}
                      className="rounded-lg bg-red-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white transition-all hover:bg-red-700 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex-shrink-0"
                      aria-label="Dismiss error"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

            {loading && (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-white py-12 sm:py-16 md:py-24 dark:border-slate-700 dark:bg-slate-800">
                <Loader2
                  className="mb-4 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin text-blue-600"
                  aria-hidden="true"
                />
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
                  Loading contacts...
                </p>
              </div>
            )}

            {!loading && !error && sortedContacts.length === 0 && (
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 sm:p-12 md:p-16 text-center dark:border-slate-700 dark:bg-slate-800">
                <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-slate-100 p-4 dark:bg-slate-700">
                  <User
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-slate-400"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  No contacts found
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  {debouncedSearchTerm.trim()
                    ? "Try adjusting your search terms"
                    : "Get started by adding your first contact"}
                </p>
              </div>
            )}

            {/* Enhanced Contacts List */}
            {!loading && !error && sortedContacts.length > 0 && (
                <div className="space-y-3" role="list" aria-label="Contacts list">
                {paginatedContacts.map((contact, idx) => (
                    <ContactCard
                    key={contact.id}
                      contact={contact}
                      isSelected={selectedContact?.id === contact.id}
                      onClick={() => handleContactSelect(contact)}
                      animationDelay={idx * 50}
                    />
                ))}
              </div>
            )}

            {!loading && !error && totalPages > 1 && (
              <nav
                className="flex items-center justify-center gap-2 sm:gap-3 pt-4 sm:pt-6"
                aria-label="Pagination"
              >
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="rounded-xl border-2 border-slate-300 bg-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-xs sm:text-sm md:text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="Previous page"
                  aria-disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 text-sm sm:text-base font-bold text-white shadow-lg">
                  <span aria-current="page">{currentPage}</span>
                  <span className="text-blue-200" aria-hidden="true">/</span>
                  <span>{totalPages}</span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-2 border-slate-300 bg-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-xs sm:text-sm md:text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="Next page"
                  aria-disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </nav>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {selectedContact ? (
              <>
                <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      Tasks
                    </h2>
                    <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400 truncate">
                      {selectedContact.name}
                    </p>
                  </div>
                  <button
                    onClick={openTaskForm}
                    disabled={showTaskForm}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-95 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
                    aria-label="Add new task"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    Add Task
                  </button>
                </div>

                {/* Enhanced Task Form */}
                {showTaskForm && (
                    <TaskForm
                      editingTask={editingTask}
                      taskTitle={taskTitle}
                      taskDescription={taskDescription}
                      submitting={submitting}
                      onTitleChange={setTaskTitle}
                      onDescriptionChange={setTaskDescription}
                      onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                      onClose={closeForm}
                    />
                )}

                {contactTasks.length === 0 ? (
                  <div className="rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-10 sm:p-12 md:p-16 text-center dark:border-slate-700 dark:bg-slate-800">
                    <CheckCircle2
                      className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-slate-300 dark:text-slate-600"
                      aria-hidden="true"
                    />
                    <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400">
                      No tasks yet
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-500">
                      Click &quot;Add Task&quot; to get started!
                    </p>
                  </div>
                ) : (
                    <div className="space-y-3" role="list" aria-label="Tasks list">
                    {contactTasks.map((task, idx) => (
                        <TaskCard
                        key={task.id}
                          task={task}
                          onToggle={() => handleToggleTask(task)}
                          onEdit={() => openEditForm(task)}
                          onDelete={() => handleDeleteTask(task.id)}
                          animationDelay={idx * 50}
                        />
                    ))}
                  </div>
                )}

                <div className="rounded-xl sm:rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 sm:p-5 md:p-6 dark:border-blue-900 dark:from-blue-950/50 dark:to-blue-900/30">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                        Total Tasks
                      </p>
                      <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                        {contactTasks.length}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                        Completed
                      </p>
                      <p className="mt-1 text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                        {contactTasks.filter((t) => t.completed).length}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-12 sm:p-16 md:p-20 text-center dark:border-slate-700 dark:bg-slate-800">
                <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-slate-100 p-4 dark:bg-slate-700">
                  <Circle
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-slate-400"
                    aria-hidden="true"
                  />
                </div>
                <p className="mb-2 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                  Select a contact
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-4">
                  Choose a contact from the list to view and manage their tasks
                </p>
              </div>
            )}
          </div>
        </div>

        {!loading && !error && sortedContacts.length > 0 && (
          <footer className="mt-6 sm:mt-8 md:mt-10 border-t-2 border-slate-200 pt-4 sm:pt-6 md:pt-8 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-xs sm:text-sm">
              <p className="font-medium text-slate-600 dark:text-slate-400">
                Showing{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {paginatedContacts.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {sortedContacts.length}
                </span>{" "}
                contacts
              </p>
              <div className="flex items-center gap-4 sm:gap-6" aria-label="Statistics">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-blue-600"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    {contacts.length} Contacts
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-600"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    {tasks.length} Tasks
                  </span>
                </div>
              </div>
            </div>
          </footer>
        )}
        </main>
      </div>
    </div>
  );
}
