export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
};

export type TaskInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
};
