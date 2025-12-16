'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { cookieService } from '@/lib/cookies';

// Demo credentials
const DEMO_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    description: 'Full Access - CRUD semua data'
  },
  {
    username: 'user',
    password: 'user123',
    role: 'user',
    description: 'Read-Only - Hanya melihat data'
  }
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Jangan redirect jika sudah login - biarkan user tetap di halaman login
  useEffect(() => {
    // Tidak ada redirect otomatis
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      // Simpan token dan user data ke cookies
      cookieService.setToken(data.token);
      if (data.user) {
        cookieService.setUser(data.user);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (user: typeof DEMO_USERS[0]) => {
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Masukkan username dan password Anda
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
            
            {/* Demo Credentials Info */}
            <div className="w-full space-y-3">
              <div className="text-sm font-semibold text-center text-gray-700 dark:text-gray-300">
                📋 Kredensial Demo:
              </div>
              
              {DEMO_USERS.map((user, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {user.role === 'admin' ? '👑' : '👤'}
                      </span>
                      <span className="font-semibold text-sm capitalize">
                        {user.role}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin(user)}
                      className="text-xs h-7"
                    >
                      Gunakan
                    </Button>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div><strong>Username:</strong> {user.username}</div>
                    <div><strong>Password:</strong> {user.password}</div>
                    <div className="text-gray-500 dark:text-gray-500 italic mt-1">
                      {user.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-center">
              Belum punya akun?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Daftar disini
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
