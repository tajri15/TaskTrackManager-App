import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { List, Clock, CheckCircle, TrendingUp } from "lucide-react";
import type { Task } from "@shared/schema";

export default function TaskStats() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-800">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <List className="text-slate-600 w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="text-2xl font-bold text-orange-600">{activeTasks}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="text-orange-600 w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600 w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completion Rate</p>
              <p className="text-2xl font-bold text-primary">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="text-primary w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
