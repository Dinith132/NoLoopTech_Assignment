import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/types/task";

const styles: Record<TaskStatus, string> = {
  TODO: "border-zinc-300 bg-zinc-100 text-zinc-600",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
  DONE: "border-green-200 bg-green-50 text-green-700",
};

const labels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className={styles[status]}>
      {labels[status]}
    </Badge>
  );
}
