"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  taskFormSchema,
  toDateInput,
  type TaskFormValues,
} from "@/lib/validations";
import type { Task, TaskStatus } from "@/types/task";

const statuses: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To do" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DONE", label: "Done" },
];

export function TaskFormDialog({
  open,
  task,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  task: Task | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    form.reset({
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
      dueDate: toDateInput(task?.dueDate ?? null),
    });
  }, [open, task, form]);

  const editing = task !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Make changes to your task here. Click save when you're done."
              : "Fill in the details below to schedule work into your sprint."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Field
            label="Title"
            required
            error={form.formState.errors.title?.message}
          >
            <Input
              placeholder="e.g., Update documentation"
              aria-invalid={Boolean(form.formState.errors.title)}
              {...form.register("title")}
            />
          </Field>
          <Field
            label="Description"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              rows={3}
              className="h-24 resize-none"
              placeholder="Add relevant context or acceptance criteria..."
              aria-invalid={Boolean(form.formState.errors.description)}
              {...form.register("description")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status" error={form.formState.errors.status?.message}>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select
                    items={statuses}
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full" aria-invalid={Boolean(form.formState.errors.status)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Due date" error={form.formState.errors.dueDate?.message}>
              <Input type="date" {...form.register("dueDate")} />
            </Field>
          </div>
          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {editing ? "Save changes" : "Save task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className={error ? "text-destructive" : undefined}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-xs font-medium text-destructive">
          <CircleAlert className="size-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
