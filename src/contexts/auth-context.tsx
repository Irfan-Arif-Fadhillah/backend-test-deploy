'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cookieService } from '@/lib/cookies';

type User = {
  id: string;
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Root page TIDAK PERLU auth check sama sekali - langsung render
    if (pathname === '/') {
      setIsLoading(false);
      return;
    }

    // Check if user is logged in from cookies
    const checkAuth = () => {
      try {
        const token = cookieService.getToken();
        const userData = cookieService.getUser();
        
        if (token && userData) {
          setUser(userData);
          setIsLoading(false);
        } else if (token) {
          // If token exists but no user data, try to fetch user info
          // Tapi jangan fetch jika di root page
          if (pathname === '/') {
            setIsLoading(false);
            return;
          }
          
          fetch('http://localhost:3001/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              // Jika 401, jangan redirect jika di root
              if (response.status === 401 && pathname === '/') {
                cookieService.clearAll();
                setIsLoading(false);
                return;
              }
              throw new Error('Failed to fetch user');
            })
            .then(data => {
              if (data) {
                setUser(data);
                cookieService.setUser(data);
              }
              setIsLoading(false);
            })
            .catch(() => {
              // Jangan redirect jika di root
              if (pathname !== '/') {
                cookieService.clearAll();
              }
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Jangan clear cookies jika di root page
        if (pathname !== '/') {
          cookieService.clearAll();
        }
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const login = async (username: string, password: string) => {
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
    // Simpan ke cookies
    cookieService.setToken(data.token);
    if (data.user) {
      cookieService.setUser(data.user);
      setUser(data.user);
    }
    router.push('/dashboard');
  };

  const logout = () => {
    cookieService.clearAll();
    setUser(null);
    // Jangan redirect jika di root page
    if (pathname !== '/') {
      router.push('/login');
    }
  };

  // Root page langsung render TANPA menunggu loading - tidak ada kondisi apapun
  if (pathname === '/') {
    return (
      <AuthContext.Provider 
        value={{ 
          user: null, 
          login, 
          logout, 
          isAuthenticated: false,
          isLoading: false
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isLoading 
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
