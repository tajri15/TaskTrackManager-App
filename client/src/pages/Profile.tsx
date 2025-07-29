import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const profileMutation = useMutation({
    mutationFn: (updatedUser: { firstName: string }) => apiRequest('PATCH', '/api/auth/me', updatedUser),
    onSuccess: () => {
      toast({ title: 'Sukses', description: 'Profil Anda telah diperbarui.' });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Gagal memperbarui profil.', variant: 'destructive' });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (passwords: object) => apiRequest('POST', '/api/auth/change-password', passwords),
    onSuccess: () => {
      toast({ title: 'Sukses', description: 'Password Anda telah diperbarui.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal memperbarui password.';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate({ firstName });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Password baru tidak cocok.', variant: 'destructive' });
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4 sm:p-8">
      <main className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-4">
            Profil Anda
          </h1>
        </div>

        {/* Card untuk Info Profil */}
        <Card className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>Perbarui detail personal Anda di sini.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled className="bg-slate-100/50 dark:bg-slate-800/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">Nama Depan</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nama depan Anda"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={profileMutation.isPending}>
                  {profileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Card untuk Ganti Password */}
        <Card className="mt-8 bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Ganti Password</CardTitle>
            <CardDescription>Masukkan password lama dan baru Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={passwordMutation.isPending}>
                  {passwordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ganti Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}