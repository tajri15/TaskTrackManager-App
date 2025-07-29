import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { CheckCheck, Trash2, Download, ChevronRight } from "lucide-react";

export default function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const markAllCompleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/tasks/mark-all-complete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "All tasks marked as complete",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to mark all tasks complete",
        variant: "destructive",
      });
    },
  });

  const clearCompletedMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/tasks/completed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Completed tasks cleared",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to clear completed tasks",
        variant: "destructive",
      });
    },
  });

  const handleExportTasks = () => {
    // Simple CSV export functionality
    const tasks = queryClient.getQueryData(["/api/tasks"]) as any[];
    if (!tasks || tasks.length === 0) {
      toast({
        title: "Info",
        description: "No tasks to export",
      });
      return;
    }

    const csv = [
      "Title,Description,Priority,Status,Due Date,Created",
      ...tasks.map(task => [
        `"${task.title}"`,
        `"${task.description || ""}"`,
        task.priority,
        task.completed ? "Completed" : "Active",
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
        new Date(task.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Tasks exported successfully",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between p-3 h-auto"
            onClick={() => markAllCompleteMutation.mutate()}
            disabled={markAllCompleteMutation.isPending}
          >
            <div className="flex items-center space-x-3">
              <CheckCheck className="text-green-600 w-4 h-4" />
              <span className="text-sm font-medium text-slate-700">Mark All Complete</span>
            </div>
            <ChevronRight className="text-slate-400 w-3 h-3" />
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-between p-3 h-auto"
            onClick={() => clearCompletedMutation.mutate()}
            disabled={clearCompletedMutation.isPending}
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="text-red-600 w-4 h-4" />
              <span className="text-sm font-medium text-slate-700">Clear Completed</span>
            </div>
            <ChevronRight className="text-slate-400 w-3 h-3" />
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-between p-3 h-auto"
            onClick={handleExportTasks}
          >
            <div className="flex items-center space-x-3">
              <Download className="text-primary w-4 h-4" />
              <span className="text-sm font-medium text-slate-700">Export Tasks</span>
            </div>
            <ChevronRight className="text-slate-400 w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
