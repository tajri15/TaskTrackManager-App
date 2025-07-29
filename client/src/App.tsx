import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import { ThemeProvider } from "@/components/theme-provider";
import ProfilePage from "@/pages/Profile";

// Komponen untuk rute yang memerlukan autentikasi
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Route {...rest}>
      {isAuthenticated ? <Component /> : <Redirect to="/login" />}
    </Route>
  );
};

function Router() {
  return (
    <Switch>
      {/* Rute Publik */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />

      {/* Rute Privat */}
      <PrivateRoute path="/" component={Dashboard} />
      <PrivateRoute path="/profile" component={ProfilePage} /> {/* <-- 2. Tambahkan rute baru */}
      
      {/* Halaman Not Found */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;