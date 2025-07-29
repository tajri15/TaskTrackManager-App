import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { format, isWithinInterval, addDays } from "date-fns";

export default function UpcomingSchedule() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Filter tugas yang memiliki due date dalam 7 hari ke depan dan belum selesai
  const upcomingTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.completed) {
        return false;
      }
      const now = new Date();
      const sevenDaysFromNow = addDays(now, 7);
      return isWithinInterval(new Date(task.dueDate), { start: now, end: sevenDaysFromNow });
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()) // Urutkan berdasarkan yang paling dekat
    .slice(0, 5); // Tampilkan maksimal 5

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      default: return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Jadwal Mendatang
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingTasks.length > 0 ? (
          <div className="space-y-4">
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{task.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {format(new Date(task.dueDate!), "eeee, d MMMM")}
                  </p>
                </div>
                <Badge variant={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Tidak ada jadwal dalam 7 hari ke depan.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
