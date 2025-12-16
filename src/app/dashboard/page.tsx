'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cookieService } from '@/lib/cookies';
import { apiClient } from '@/lib/api';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Search, LogOut } from 'lucide-react';

type User = {
  id: number;
  username: string;
  role: string;
  created_at?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
  });

  // Cek apakah user adalah admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const token = cookieService.getToken();
    const userData = cookieService.getUser();
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(userData);
    }

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/users');

      if (response.ok) {
        const result = await response.json();
        // Backend mengembalikan { success: true, data: [...], total: ... }
        setUsers(result.data || []);
      } else {
        // Jika response tidak OK, cek apakah 401 (unauthorized)
        if (response.status === 401) {
          // Token expired atau invalid - clear dan redirect
          cookieService.clearAll();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return;
        }
        const error = await response.json().catch(() => ({}));
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Jika error karena token expired, interceptor sudah handle redirect
      if (error instanceof Error && error.message.includes('Token expired')) {
        // Interceptor sudah handle, tidak perlu lakukan apa-apa
        return;
      }
      // Untuk error lain, tampilkan tabel kosong
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Hapus semua cookies dan storage
    cookieService.clearAll();
    // Reset state
    setUser(null);
    setUsers([]);
    // Redirect ke login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const handleCreate = () => {
    if (!isAdmin) return;
    setSelectedUser(null);
    setFormData({
      username: '',
      password: '',
      role: 'user',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    if (!isAdmin) return;
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (!isAdmin) return;
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      const body: any = {
        username: formData.username,
        role: formData.role,
      };

      if (!selectedUser || formData.password) {
        body.password = formData.password;
      }

      const response = selectedUser
        ? await apiClient.put(`/users/${selectedUser.id}`, body)
        : await apiClient.post('/users', body);

      if (response.ok) {
        setIsDialogOpen(false);
        fetchUsers();
        setFormData({
          username: '',
          password: '',
          role: 'user',
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser || !isAdmin) return;

    try {
      const response = await apiClient.delete(`/users/${selectedUser.id}`);

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Users</h1>
            <p className="text-muted-foreground">
              Selamat datang, <strong>{user?.username}</strong> ({user?.role})
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah User
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Users</CardTitle>
            <CardDescription>
              {isAdmin 
                ? 'Kelola pengguna sistem (Create, Read, Update, Delete)' 
                : 'Lihat daftar pengguna (Read-Only)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell 
                        colSpan={isAdmin ? 5 : 4} 
                        className="text-center text-muted-foreground"
                      >
                        {isLoading ? 'Memuat data...' : 'Tidak ada data'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.created_at 
                            ? new Date(user.created_at).toLocaleDateString('id-ID')
                            : '-'}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(user)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog - Hanya untuk Admin */}
        {isAdmin && (
          <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedUser ? 'Edit User' : 'Tambah User Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedUser
                      ? 'Ubah informasi user di bawah ini.'
                      : 'Isi form di bawah ini untuk menambahkan user baru.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">
                        Password {selectedUser && '(kosongkan jika tidak ingin mengubah)'}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required={!selectedUser}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          setFormData({ ...formData, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button type="submit">
                      {selectedUser ? 'Perbarui' : 'Buat'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Hapus User</DialogTitle>
                  <DialogDescription>
                    Apakah Anda yakin ingin menghapus user{' '}
                    <strong>{selectedUser?.username}</strong>? Tindakan ini tidak dapat
                    dibatalkan.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                    Hapus
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
