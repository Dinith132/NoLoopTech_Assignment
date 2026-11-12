import { Pencil, Trash2, TriangleAlert } from "lucide-react";
import { TaskStatusBadge } from "@/components/task-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Task } from "@/types/task";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === "DONE") {
    return false;
  }
  const due = new Date(task.dueDate);
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDay < today;
}

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
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
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="px-4 py-3 whitespace-normal">
              <div className="flex flex-col">
                <span
                  className={
                    task.status === "DONE"
                      ? "font-medium text-zinc-900 line-through decoration-zinc-400"
                      : "font-medium text-zinc-900"
                  }
                >
                  {task.title}
                </span>
                {task.description ? (
                  <span className="mt-0.5 text-xs text-zinc-500">
                    {task.description}
                  </span>
                ) : null}
              </div>
            </TableCell>
            <TableCell className="px-4">
              <TaskStatusBadge status={task.status} />
            </TableCell>
            <TableCell className="px-4">
              {task.dueDate ? (
                <span
                  className={
                    isOverdue(task)
                      ? "inline-flex items-center gap-1 text-xs font-medium text-red-600"
                      : "text-xs text-zinc-500"
                  }
                >
                  {isOverdue(task) ? (
                    <TriangleAlert className="size-3.5" />
                  ) : null}
                  {formatDate(task.dueDate)}
                </span>
              ) : (
                <span className="text-xs text-zinc-400">-</span>
              )}
            </TableCell>
            <TableCell className="px-4 text-xs text-zinc-500">
              {formatDate(task.createdAt)}
            </TableCell>
            <TableCell className="px-4 text-right">
              <div className="inline-flex items-center justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit task"
                  onClick={() => onEdit(task)}
                >
                  <Pencil />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete task"
                  className="hover:bg-red-50 hover:text-red-700"
                  onClick={() => onDelete(task)}
                >
                  <Trash2 />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
