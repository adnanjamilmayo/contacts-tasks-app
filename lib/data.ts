import { Contact, Task } from "./types";

const generateContacts = (): Contact[] => {
  const firstNames = [
    "Alex",
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
    "Karen",
    "Leo",
    "Mia",
    "Noah",
    "Olivia",
    "Paul",
    "Quinn",
    "Rachel",
    "Sam",
    "Tina",
    "Uma",
    "Victor",
    "Wendy",
    "Xavier",
    "Yara",
    "Zane",
    "Amy",
    "Ben",
    "Cara",
    "Dan",
    "Emma",
    "Finn",
    "Gina",
    "Hugo",
    "Isla",
    "Jake",
    "Kate",
    "Luke",
    "Maya",
    "Nick",
    "Ora",
    "Pete",
    "Quinn",
    "Rosa",
    "Sean",
    "Tara",
    "Uma",
    "Vince",
    "Will",
  ];

  const lastNames = [
    "Anderson",
    "Brown",
    "Davis",
    "Garcia",
    "Harris",
    "Jackson",
    "Johnson",
    "Jones",
    "Lee",
    "Martinez",
    "Miller",
    "Moore",
    "Robinson",
    "Smith",
    "Taylor",
    "Thompson",
    "Walker",
    "White",
    "Williams",
    "Wilson",
    "Adams",
    "Baker",
    "Clark",
    "Collins",
    "Evans",
    "Green",
    "Hall",
    "Hill",
    "King",
    "Lewis",
    "Martin",
    "Martinez",
    "Mitchell",
    "Nelson",
    "Parker",
    "Phillips",
    "Roberts",
    "Rodriguez",
    "Scott",
    "Stewart",
    "Turner",
    "Ward",
    "Watson",
    "Wright",
    "Young",
    "Allen",
    "Carter",
    "Cooper",
    "Flores",
    "Gomez",
  ];

  const companies = [
    "Tech Corp",
    "Design Studio",
    "Consulting Group",
    "Marketing Agency",
    "Finance Inc",
    "Healthcare LLC",
    "Education Hub",
    "Retail Co",
    "Food Services",
    "Transportation Ltd",
    "Innovation Labs",
    "Creative Solutions",
    "Digital Ventures",
    "Global Enterprises",
    "Future Systems",
    "Smart Technologies",
    "Premium Services",
    "Elite Consulting",
    "Advanced Solutions",
    "NextGen Industries",
  ];

  const domains = [
    "email.com",
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "company.com",
    "business.com",
    "corp.net",
    "enterprise.io",
    "digital.com",
    "tech.org",
  ];

  const contacts: Contact[] = [];

  for (let i = 0; i < 10000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const companyIndex = Math.floor(Math.random() * companies.length);

    const emailBase = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const uniqueEmail =
      i > 0 ? `${emailBase}${i}@${domain}` : `${emailBase}@${domain}`;

    const areaCode = String(200 + (i % 800));
    const phoneNum = String(1000 + (i % 9000));
    const phoneLast = String(1000 + ((i * 17) % 9000));

    contacts.push({
      id: `contact-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: uniqueEmail,
      phone: `+1-${areaCode}-${phoneNum.slice(0, 3)}-${phoneLast.slice(0, 4)}`,
      company: companies[companyIndex],
      createdAt: new Date(2024, 0, 1 + (i % 365)),
    });
  }

  return contacts;
};

const generateTasks = (contacts: Contact[]): Task[] => {
  const tasks: Task[] = [];
  const taskTemplates = [
    { title: "Follow up on project proposal" },
    { title: "Schedule meeting", description: "Discuss quarterly goals" },
    { title: "Review contract", description: "Legal review needed" },
    { title: "Send thank you note" },
    { title: "Book travel arrangements", description: "Conference in Q2" },
    { title: "Prepare presentation", description: "Q4 results review" },
    { title: "Update project timeline" },
    { title: "Conduct market research", description: "Competitor analysis" },
    { title: "Schedule team training" },
    { title: "Review budget proposal", description: "Financial planning" },
  ];

  contacts.forEach((contact, index) => {
    const taskCount = index % 5;
    for (let i = 0; i < taskCount; i++) {
      const template =
        taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const daysAgo = Math.floor(Math.random() * 90);

      tasks.push({
        id: `task-${tasks.length + 1}`,
        contactId: contact.id,
        title: template.title,
        description: template.description,
        completed: Math.random() > 0.6,
        createdAt: new Date(2024, 11, 31 - daysAgo),
        updatedAt: new Date(
          2024,
          11,
          31 - daysAgo + Math.floor(Math.random() * 5)
        ),
      });
    }
  });

  return tasks;
};

// eslint-disable-next-line prefer-const
let contacts: Contact[] = generateContacts();
// eslint-disable-next-line prefer-const
let tasks: Task[] = generateTasks(contacts);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const shouldFail = () => Math.random() < 0.1;

export const contactApi = {
  async getAll() {
    await delay(300);
    if (shouldFail()) {
      throw new Error("Failed to fetch contacts. Please try again.");
    }
    return [...contacts];
  },

  async getById(id: string) {
    await delay(150);
    if (shouldFail()) {
      throw new Error("Failed to fetch contact. Please try again.");
    }
    const contact = contacts.find((c) => c.id === id);
    if (!contact) throw new Error("Contact not found");
    return contact;
  },
};

export const taskApi = {
  async getAll() {
    await delay(200);
    if (shouldFail()) {
      throw new Error("Failed to fetch tasks. Please try again.");
    }
    return [...tasks];
  },

  async getByContactId(contactId: string) {
    await delay(100);
    if (shouldFail()) {
      throw new Error("Failed to fetch tasks. Please try again.");
    }
    return tasks.filter((t) => t.contactId === contactId);
  },

  async create(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
    await delay(250);
    if (shouldFail()) {
      throw new Error("Failed to create task. Please try again.");
    }

    if (!task.contactId) {
      throw new Error("Contact ID is required");
    }
    if (!task.title || !task.title.trim()) {
      throw new Error("Task title is required");
    }
    if (task.title.trim().length > 200) {
      throw new Error("Task title must be 200 characters or less");
    }
    
    const newTask: Task = {
      ...task,
      title: task.title.trim(),
      description: task.description?.trim() || undefined,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tasks.push(newTask);
    return newTask;
  },

  async update(id: string, updates: Partial<Task>) {
    await delay(250);
    if (shouldFail()) {
      throw new Error("Failed to update task. Please try again.");
    }
    if (!id || typeof id !== "string") {
      throw new Error("Invalid task ID");
    }
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");

    const trimmedUpdates: Partial<Task> = { ...updates };
    if (updates.title !== undefined) {
      const trimmedTitle = updates.title.trim();
      if (!trimmedTitle) {
        throw new Error("Task title cannot be empty");
      }
      if (trimmedTitle.length > 200) {
        throw new Error("Task title must be 200 characters or less");
      }
      trimmedUpdates.title = trimmedTitle;
    }
    if (updates.description !== undefined) {
      trimmedUpdates.description = updates.description.trim() || undefined;
    }
    
    tasks[index] = { ...tasks[index], ...trimmedUpdates, updatedAt: new Date() };
    return tasks[index];
  },

  async delete(id: string) {
    await delay(250);
    if (shouldFail()) {
      throw new Error("Failed to delete task. Please try again.");
    }
    if (!id || typeof id !== "string") {
      throw new Error("Invalid task ID");
    }
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    tasks.splice(index, 1);
    return true;
  },
};
