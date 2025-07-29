import { useAuth } from "@/hooks/useAuth";
import TaskStats from "@/components/TaskStats";
import TaskFilters from "@/components/TaskFilters";
import TaskForm from "@/components/TaskForm";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import UpcomingSchedule from "@/components/UpcomingSchedule";
import { ListTodo } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <ListTodo className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                TaskTrack Pro
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Welcome back,{" "}
              <span className="text-primary dark:text-blue-400">
                {user?.firstName || "there"}
              </span>
              ! 👋
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
              Here's your productivity overview for today. You've got this!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <TaskStats />

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TaskFilters />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentActivity />
              <UpcomingSchedule />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TaskForm />
            <QuickActions />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} TaskTrack Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}