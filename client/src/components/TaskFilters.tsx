import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskItem from "./TaskItem";
import type { Task } from "@shared/schema";
import { ClipboardList, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterType = "all" | "active" | "completed";
type SortType = "createdAt-desc" | "dueDate-asc" | "priority-desc";

export default function TaskFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortType>("createdAt-desc");
  
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const processedTasks = tasks
    .filter(task => { // Filter by status
      if (activeFilter === "active") return !task.completed;
      if (activeFilter === "completed") return task.completed;
      return true;
    })
    .filter(task => { // Filter by search query
      const query = searchQuery.toLowerCase();
      return task.title.toLowerCase().includes(query) || 
             (task.description && task.description.toLowerCase().includes(query));
    })
    .sort((a, b) => { // Sort the filtered tasks
      switch (sortOrder) {
        case "dueDate-asc":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority-desc":
          const priorityValue = { high: 3, medium: 2, low: 1 };
          return priorityValue[b.priority] - priorityValue[a.priority];
        case "createdAt-desc":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-slate-200 rounded"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-slate-800">Your Tasks</h3>
          
          {/* PERBAIKAN DI SINI: Menambahkan sm:flex-wrap dan sm:justify-end */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:w-64"
              />
            </div>

            <Select value={sortOrder} onValueChange={(value: SortType) => setSortOrder(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Sort by Newest</SelectItem>
                <SelectItem value="dueDate-asc">Sort by Due Date</SelectItem>
                <SelectItem value="priority-desc">Sort by Priority</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex bg-slate-100 rounded-lg p-1">
              <Button
                variant={activeFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 text-sm ${
                  activeFilter === "all" 
                    ? "bg-white text-slate-700 shadow-sm" 
                    : "text-slate-600 hover:text-slate-700"
                }`}
              >
                All
              </Button>
              <Button
                variant={activeFilter === "active" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter("active")}
                className={`px-3 py-1 text-sm ${
                  activeFilter === "active" 
                    ? "bg-white text-slate-700 shadow-sm" 
                    : "text-slate-600 hover:text-slate-700"
                }`}
              >
                Active
              </Button>
              <Button
                variant={activeFilter === "completed" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter("completed")}
                className={`px-3 py-1 text-sm ${
                  activeFilter === "completed" 
                    ? "bg-white text-slate-700 shadow-sm" 
                    : "text-slate-600 hover:text-slate-700"
                }`}
              >
                Completed
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      {processedTasks.length > 0 ? (
        <div className="divide-y divide-slate-200">
          {processedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="text-slate-400 w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No tasks found</h3>
          <p className="text-slate-600 mb-4">
            {searchQuery 
              ? `No tasks match your search for "${searchQuery}".`
              : `No ${activeFilter} tasks at the moment.`
            }
          </p>
        </div>
      )}
    </Card>
  );
}
