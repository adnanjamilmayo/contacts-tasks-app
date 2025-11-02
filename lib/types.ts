export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  contactId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SortField = "name" | "email" | "company" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface ContactsFilter {
  search: string;
  sortBy: SortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}
