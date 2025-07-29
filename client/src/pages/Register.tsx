import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle } from "lucide-react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, password }),
      });

      if (res.ok) {
        setLocation('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl overflow-hidden border-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <CardHeader className="p-0">
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-blue-100">
              Join us to get started
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-gray-700">Full Name</Label>
              <Input 
                id="firstName" 
                type="text" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
                required 
                placeholder="Cristiano Ronaldo" 
                className="py-2 px-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="your@email.com" 
                className="py-2 px-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="py-2 px-4 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Create Account'}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            
            <Button 
              type="button"
              variant="outline" 
              className="w-full py-3 border-blue-500 text-blue-600 hover:bg-blue-50 font-medium rounded-lg"
              onClick={() => setLocation('/login')}
            >
              Sign In Instead
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}