import type { Task, TaskInput } from "@/types/task";

function apiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return new URL(path, base).toString();
}

async function errorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) {
      return body.message.join(", ");
    }
    if (body.message) {
      return body.message;
    }
  } catch {
    return response.statusText;
  }
  return response.statusText;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), init);
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function getTasks() {
  return request<Task[]>("/tasks");
}

export function getTask(id: number) {
  return request<Task>(`/tasks/${id}`);
}

export function createTask(input: TaskInput) {
  return request<Task>("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateTask(id: number, input: TaskInput) {
  return request<Task>(`/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteTask(id: number) {
  return request<Task>(`/tasks/${id}`, { method: "DELETE" });
}
