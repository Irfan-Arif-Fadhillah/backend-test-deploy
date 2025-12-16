import Cookies from 'js-cookie';

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export const cookieService = {
  setToken: (token: string) => {
    Cookies.set('token', token, COOKIE_OPTIONS);
  },

  getToken: (): string | undefined => {
    return Cookies.get('token');
  },

  removeToken: () => {
    Cookies.remove('token', { path: '/' });
  },

  setUser: (user: any) => {
    Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);
  },

  getUser: () => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    Cookies.remove('user', { path: '/' });
  },

  clearAll: () => {
    // Hapus cookie dengan berbagai opsi untuk memastikan terhapus
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    
    // Juga hapus dengan domain jika di browser
    if (typeof window !== 'undefined') {
      // Hapus semua cookies secara manual
      document.cookie.split(";").forEach((c) => {
        const name = c.trim().split("=")[0];
        // Hapus dengan berbagai kombinasi path dan domain
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
      });
      
      // Set cookie dengan tanggal expired untuk memastikan terhapus
      Cookies.set('token', '', { expires: -1, path: '/' });
      Cookies.set('user', '', { expires: -1, path: '/' });
      
      // Juga clear localStorage dan sessionStorage jika ada
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Ignore jika tidak bisa clear
      }
    }
  },
  
  // Utility untuk clear cookies secara manual (bisa dipanggil dari browser console)
  forceClearAll: () => {
    if (typeof window !== 'undefined') {
      // Hapus semua cookies
      document.cookie.split(";").forEach((c) => {
        const name = c.trim().split("=")[0];
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=localhost;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.localhost;`;
      });
      
      // Clear storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect ke login
      window.location.href = '/login';
    }
  },
};

// Export untuk bisa dipanggil dari browser console
if (typeof window !== 'undefined') {
  (window as any).clearAuthCookies = cookieService.forceClearAll;
}
