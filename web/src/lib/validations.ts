import { z } from "zod";
import type { TaskInput } from "@/types/task";

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  dueDate: z.string(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export function toDateInput(iso: string | null) {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function toTaskInput(values: TaskFormValues): TaskInput {
  const description = values.description.trim();
  return {
    title: values.title.trim(),
    description: description ? description : null,
    status: values.status,
    dueDate: values.dueDate
      ? new Date(`${values.dueDate}T00:00:00`).toISOString()
      : null,
  };
}
