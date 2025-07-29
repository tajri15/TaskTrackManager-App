import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash2, Calendar, Check } from "lucide-react";
import type { Task } from "@shared/schema";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/tasks/${task.id}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui tugas.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/tasks/${task.id}`, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      dueDate: editDueDate ? new Date(editDueDate) : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsEditing(false);
      toast({ title: "Sukses", description: "Tugas berhasil diperbarui." });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui tugas.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/tasks/${task.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Sukses", description: "Tugas berhasil dihapus." });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus tugas.", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast({ title: "Error", description: "Judul tugas tidak boleh kosong.", variant: "destructive" });
      return;
    }
    updateMutation.mutate();
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    setIsEditing(false);
  };

  const formatDueDate = (date: string | null) => {
    if (!date) return null;
    const dueDate = new Date(date);
    if (isToday(dueDate)) return "Jatuh tempo hari ini";
    if (isTomorrow(dueDate)) return "Jatuh tempo besok";
    if (isYesterday(dueDate)) return "Jatuh tempo kemarin";
    return `Jatuh tempo ${format(dueDate, "d MMM")}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
      <div className="flex items-start space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleMutation.mutate()}
          disabled={toggleMutation.isPending}
          className={`mt-1 w-5 h-5 p-0 rounded-full border-2 flex-shrink-0 ${
            task.completed ? "border-primary bg-primary" : "border-slate-300 dark:border-slate-600"
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </Button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-sm"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="w-full text-xs"
                placeholder="Tambah deskripsi..."
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Prioritas</Label>
                  <Select value={editPriority} onValueChange={(value: "low" | "medium" | "high") => setEditPriority(value)}>
                    <SelectTrigger className="mt-1 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Tgl. Selesai</Label>
                  <Input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                  Simpan
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-medium ${
                  task.completed ? "text-slate-500 dark:text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"
                }`}>
                  {task.title}
                </h4>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {task.description && (
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 mt-2">
                {task.dueDate && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {formatDueDate(task.dueDate)}
                  </span>
                )}
                <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                  Prioritas {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
