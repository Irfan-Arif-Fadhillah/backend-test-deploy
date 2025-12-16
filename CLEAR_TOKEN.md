# Cara Clear Token Kadaluarsa

Jika Anda terjebak dengan token lama yang kadaluarsa, gunakan salah satu cara berikut:

## Cara 1: Gunakan Browser Console (Paling Mudah)

1. Buka browser console (F12 atau Right Click > Inspect > Console)
2. Ketik perintah berikut dan tekan Enter:

```javascript
clearAuthCookies()
```

Atau manual:

```javascript
// Hapus semua cookies
document.cookie.split(";").forEach((c) => {
  const name = c.trim().split("=")[0];
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=localhost;`;
});

// Clear storage
localStorage.clear();
sessionStorage.clear();

// Redirect ke login
window.location.href = '/login';
```

## Cara 2: Clear Cookies dari Browser Settings

1. **Chrome/Edge:**
   - Tekan `Ctrl+Shift+Delete` (Windows) atau `Cmd+Shift+Delete` (Mac)
   - Pilih "Cookies and other site data"
   - Pilih "All time"
   - Klik "Clear data"

2. **Firefox:**
   - Tekan `Ctrl+Shift+Delete` (Windows) atau `Cmd+Shift+Delete` (Mac)
   - Pilih "Cookies"
   - Pilih "Everything"
   - Klik "Clear Now"

3. **Safari:**
   - Safari > Preferences > Privacy
   - Klik "Manage Website Data"
   - Pilih localhost dan klik "Remove"

## Cara 3: Gunakan Incognito/Private Mode

Buka aplikasi di Incognito/Private mode untuk menghindari cookie lama.

## Cara 4: Restart Backend Server

Jika token disimpan di memory backend (seperti di project ini), restart backend server akan menghapus semua token:

```bash
# Stop server (Ctrl+C)
# Start lagi
npm run dev
```

## Catatan

- Token di project ini disimpan di **memory backend**, jadi restart backend akan menghapus semua token
- Cookie di frontend akan otomatis terhapus jika backend mengembalikan status 401 (Unauthorized)
- Sistem sekarang sudah auto-handle expired token dan akan redirect ke login otomatis

