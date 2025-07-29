import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus } from "lucide-react";
import type { InsertTask } from "@shared/schema";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (task: InsertTask) => {
      await apiRequest("POST", "/api/tasks", task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    // PENANGANAN ERROR YANG LEBIH BAIK
    onError: (error: Error) => {
      let description = "Failed to create task. Please try again.";
      // Mencoba parsing pesan error detail dari backend
      try {
        const jsonString = error.message.substring(error.message.indexOf('{'));
        const errorObj = JSON.parse(jsonString);
        if (errorObj && errorObj.message) {
          description = errorObj.message;
        }
      } catch (e) {
        console.error("Could not parse error message:", error.message);
      }
      toast({
        title: "Error",
        description: description,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    const task: InsertTask = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate.trim() ? new Date(dueDate) : undefined,
    };

    // LOGGING UNTUK DEBUGGING
    // Buka Developer Tools (F12) di browser Anda dan lihat tab "Console"
    console.log("Data yang dikirim ke server:", task);

    createMutation.mutate(task);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Task</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              Task Title
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add task description..."
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-slate-700">Priority</Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dueDate" className="text-sm font-medium text-slate-700">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            {createMutation.isPending ? "Adding..." : "Add Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
