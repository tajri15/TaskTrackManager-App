import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Get recent activities (recently created or updated tasks)
  const recentActivities = tasks
    .slice()
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
    .slice(0, 5)
    .map(task => {
      const isRecentlyCompleted = task.completed && task.updatedAt && task.createdAt && 
        new Date(task.updatedAt).getTime() > new Date(task.createdAt).getTime();
      
      return {
        ...task,
        action: isRecentlyCompleted ? "Completed" : "Created",
        timestamp: task.updatedAt || task.createdAt,
      };
    });

  const getActivityColor = (action: string) => {
    switch (action) {
      case "Completed": return "bg-green-600";
      case "Created": return "bg-blue-600";
      case "Updated": return "bg-orange-600";
      default: return "bg-slate-600";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
        
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div key={`${activity.id}-${activity.action}`} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.action)}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">{activity.action}</span> "{activity.title}"
                  </p>
                  <p className="text-xs text-slate-500">
                    {activity.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : "Recently"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-slate-600">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
