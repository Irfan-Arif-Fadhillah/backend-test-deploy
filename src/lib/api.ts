import { cookieService } from './cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper untuk handle expired token - JANGAN redirect jika di root page
const handleExpiredToken = () => {
  cookieService.clearAll();
  if (typeof window !== 'undefined') {
    // Jangan redirect jika di root page
    if (window.location.pathname === '/') {
      return; // Jangan redirect, biarkan user tetap di root
    }
    // Hapus semua cookies secara manual juga
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // Redirect ke login hanya jika bukan di root page
    window.location.href = '/login';
  }
};

// Interceptor untuk check response
const checkResponse = (response: Response): Response => {
  if (response.status === 401) {
    // Token expired atau invalid - clear semua dan redirect (kecuali di root)
    handleExpiredToken();
    return response;
  }
  return response;
};

export const apiClient = {
  get: async (endpoint: string) => {
    const token = cookieService.getToken();
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const checkedResponse = checkResponse(response);
    if (checkedResponse.status === 401) {
      throw new Error('Token expired. Please login again.');
    }
    return checkedResponse;
  },

  post: async (endpoint: string, data: any) => {
    const token = cookieService.getToken();
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const checkedResponse = checkResponse(response);
    if (checkedResponse.status === 401) {
      throw new Error('Token expired. Please login again.');
    }
    return checkedResponse;
  },

  put: async (endpoint: string, data: any) => {
    const token = cookieService.getToken();
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const checkedResponse = checkResponse(response);
    if (checkedResponse.status === 401) {
      throw new Error('Token expired. Please login again.');
    }
    return checkedResponse;
  },

  delete: async (endpoint: string) => {
    const token = cookieService.getToken();
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const checkedResponse = checkResponse(response);
    if (checkedResponse.status === 401) {
      throw new Error('Token expired. Please login again.');
    }
    return checkedResponse;
  },
};

// Auth functions
export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  
  if (data.token) {
    cookieService.setToken(data.token);
    if (data.user) {
      cookieService.setUser(data.user);
    }
  }

  return data;
};

export const register = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

export const logout = () => {
  handleExpiredToken();
};

// Stats functions
export const getUserStats = async () => {
  const token = cookieService.getToken();
  const response = await fetch(`${API_URL}/api/stats/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (response.status === 401) {
    // Token expired - tapi jangan redirect jika dipanggil dari public page
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Token expired or unauthorized');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch user stats');
  }

  return response.json();
};

// Default export untuk kompatibilitas dengan import default
const api = {
  login,
  register,
  logout,
  getUserStats,
  ...apiClient,
};

export default api;
