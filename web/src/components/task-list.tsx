"use client";

import { ClipboardCheck, Plus, RotateCw, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DeleteTaskDialog } from "@/components/delete-task-dialog";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { TaskTable } from "@/components/task-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import { toTaskInput, type TaskFormValues } from "@/lib/validations";
import type { Task, TaskStatus } from "@/types/task";

type StatusFilter = "ALL" | TaskStatus;
type DueSort = "asc" | "desc";

const statusItems = {
  ALL: "All",
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

const sortItems = {
  asc: "Due date ascending",
  desc: "Due date descending",
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [sort, setSort] = useState<DueSort>("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setTasks(await getTasks());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(() => {
    const filtered =
      status === "ALL" ? tasks : tasks.filter((task) => task.status === status);
    return [...filtered].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) {
        return 0;
      }
      if (!a.dueDate) {
        return 1;
      }
      if (!b.dueDate) {
        return -1;
      }
      const diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return sort === "asc" ? diff : -diff;
    });
  }, [tasks, status, sort]);

  async function save(values: TaskFormValues) {
    const input = toTaskInput(values);
    try {
      if (editing) {
        const updated = await updateTask(editing.id, input);
        setTasks((current) =>
          current.map((task) => (task.id === updated.id ? updated : task)),
        );
        toast.success("Task updated");
      } else {
        const created = await createTask(input);
        setTasks((current) => [created, ...current]);
        toast.success("Task created");
      }
      setFormOpen(false);
      setEditing(null);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Request failed");
      throw caught;
    }
  }

  async function confirmDelete(task: Task) {
    try {
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setDeleting(null);
      toast.success("Task deleted");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Request failed");
      throw caught;
    }
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Tasks
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage your work in one place
            </p>
          </div>
          <Button type="button" onClick={openCreate}>
            <Plus />
            New task
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            items={statusItems}
            value={status}
            onValueChange={(value) => {
              if (value) {
                setStatus(value as StatusFilter);
              }
            }}
            disabled={loading || error !== null}
          >
            <SelectTrigger className="h-9">
              <span className="text-zinc-500">Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="TODO">To do</SelectItem>
              <SelectItem value="IN_PROGRESS">In progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select
            items={sortItems}
            value={sort}
            onValueChange={(value) => {
              if (value === "asc" || value === "desc") {
                setSort(value);
              }
            }}
            disabled={loading || error !== null}
          >
            <SelectTrigger className="h-9">
              <span className="text-zinc-500">Sort by:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Due date ascending</SelectItem>
              <SelectItem value="desc">Due date descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          {loading ? <LoadingRows /> : null}
          {!loading && error ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-700">
                <TriangleAlert />
              </div>
              <h2 className="text-base font-semibold tracking-tight">
                Something went wrong
              </h2>
              <p className="mt-1 mb-6 max-w-sm text-sm text-zinc-500">
                Could not load tasks. There was a problem fetching this view
                from the server.
              </p>
              <Button type="button" variant="outline" onClick={() => void load()}>
                <RotateCw />
                Try again
              </Button>
            </div>
          ) : null}
          {!loading && !error && tasks.length === 0 ? (
            <div className="flex min-h-[440px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                <ClipboardCheck />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">No tasks yet</h2>
              <p className="mt-1 mb-6 max-w-sm text-sm text-zinc-500">
                Create your first task to get started and monitor milestones
                across your team.
              </p>
              <Button type="button" onClick={openCreate}>
                <Plus />
                New task
              </Button>
            </div>
          ) : null}
          {!loading && !error && tasks.length > 0 && visible.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <p className="text-sm text-zinc-500">No tasks match this filter</p>
              <Button type="button" variant="outline" onClick={() => setStatus("ALL")}>
                Clear filter
              </Button>
            </div>
          ) : null}
          {!loading && !error && visible.length > 0 ? (
            <TaskTable
              tasks={visible}
              onEdit={(task) => {
                setEditing(task);
                setFormOpen(true);
              }}
              onDelete={setDeleting}
            />
          ) : null}
        </section>
      </div>
      <TaskFormDialog
        open={formOpen}
        task={editing}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditing(null);
          }
        }}
        onSubmit={save}
      />
      <DeleteTaskDialog
        task={deleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </main>
  );
}

function LoadingRows() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-zinc-50 hover:bg-zinc-50">
          <TableHead className="px-4 text-xs tracking-wider text-zinc-500 uppercase">
            Title
          </TableHead>
          <TableHead className="w-36 px-4 text-xs tracking-wider text-zinc-500 uppercase">
            Status
          </TableHead>
          <TableHead className="w-40 px-4 text-xs tracking-wider text-zinc-500 uppercase">
            Due date
          </TableHead>
          <TableHead className="w-36 px-4 text-xs tracking-wider text-zinc-500 uppercase">
            Created
          </TableHead>
          <TableHead className="w-24 px-4 text-right text-xs tracking-wider text-zinc-500 uppercase">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }, (_, index) => (
          <TableRow key={index} className="hover:bg-transparent">
            <TableCell className="px-4 py-3.5">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="mt-2 h-3 w-64" />
            </TableCell>
            <TableCell className="px-4">
              <Skeleton className="h-5 w-20 rounded-full" />
            </TableCell>
            <TableCell className="px-4">
              <Skeleton className="h-3.5 w-24" />
            </TableCell>
            <TableCell className="px-4">
              <Skeleton className="h-3.5 w-20" />
            </TableCell>
            <TableCell className="px-4 text-right">
              <Skeleton className="mr-1.5 inline-block size-7" />
              <Skeleton className="inline-block size-7" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
