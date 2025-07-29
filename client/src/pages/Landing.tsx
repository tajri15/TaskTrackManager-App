import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, BarChart3, ListTodo } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ListTodo className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">TaskTrack</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={handleLogin}>
                Sign In
              </Button>
              <Button onClick={handleLogin}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Intelligent Task Management
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Stay organized, boost productivity, and never miss a deadline with TaskTrack's 
            powerful task management platform.
          </p>
          <Button size="lg" onClick={handleLogin} className="text-lg px-8 py-3">
            Start Managing ListTodo
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Easy Task Management</h3>
              <p className="text-slate-600">
                Create, update, and complete tasks with our intuitive interface designed for productivity.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-orange-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Priority Management</h3>
              <p className="text-slate-600">
                Set priorities and due dates to ensure you focus on what matters most.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Progress Tracking</h3>
              <p className="text-slate-600">
                Monitor your productivity with detailed statistics and completion rates.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg border border-slate-200 p-8">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">
            Ready to get organized?
          </h3>
          <p className="text-slate-600 mb-6">
            Join thousands of users who trust TaskTrack to manage their daily tasks and projects.
          </p>
          <Button size="lg" onClick={handleLogin}>
            Get Started Free
          </Button>
        </div>
      </main>
    </div>
  );
}
