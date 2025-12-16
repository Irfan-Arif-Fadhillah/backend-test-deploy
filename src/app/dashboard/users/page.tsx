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
import { useToast } from '@/hooks/use-toast';
import { cookieService } from '@/lib/cookies';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
};

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  // Cek apakah user adalah admin
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const token = cookieService.getToken();
    if (!token || !isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchUsers();
  }, [router, isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/api/users');

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 401) {
        cookieService.clearAll();
        router.push('/login');
      } else {
        // Mock data jika API belum tersedia
        setUsers([
          { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin' },
          { id: '2', username: 'user1', email: 'user1@example.com', role: 'user' },
          { id: '3', username: 'user2', email: 'user2@example.com', role: 'user' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data untuk development
      setUsers([
        { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin' },
        { id: '2', username: 'user1', email: 'user1@example.com', role: 'user' },
        { id: '3', username: 'user2', email: 'user2@example.com', role: 'user' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    if (!isAdmin) {
      toast({
        title: 'Akses Ditolak',
        description: 'Hanya admin yang dapat menambahkan pengguna baru.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    if (!isAdmin) {
      toast({
        title: 'Akses Ditolak',
        description: 'Hanya admin yang dapat mengedit pengguna.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (!isAdmin) {
      toast({
        title: 'Akses Ditolak',
        description: 'Hanya admin yang dapat menghapus pengguna.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      toast({
        title: 'Akses Ditolak',
        description: 'Hanya admin yang dapat melakukan perubahan.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const body: any = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
      };

      if (!selectedUser || formData.password) {
        body.password = formData.password;
      }

      const response = selectedUser
        ? await apiClient.put(`/api/users/${selectedUser.id}`, body)
        : await apiClient.post('/api/users', body);

      if (response.ok) {
        toast({
          title: selectedUser ? 'Pengguna diperbarui' : 'Pengguna dibuat',
          description: selectedUser
            ? 'Data pengguna berhasil diperbarui.'
            : 'Pengguna baru berhasil dibuat.',
        });
        setIsDialogOpen(false);
        fetchUsers();
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'user',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    if (!isAdmin) {
      toast({
        title: 'Akses Ditolak',
        description: 'Hanya admin yang dapat menghapus pengguna.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await apiClient.delete(`/api/users/${selectedUser.id}`);

      if (response.ok) {
        toast({
          title: 'Pengguna dihapus',
          description: 'Pengguna berhasil dihapus.',
        });
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Kelola pengguna sistem dengan mudah' 
              : 'Lihat daftar pengguna dalam sistem'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Semua pengguna yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pengguna..."
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
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={isAdmin ? 4 : 3} 
                      className="text-center text-muted-foreground"
                    >
                      Tidak ada pengguna ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? 'Ubah informasi pengguna di bawah ini.'
                : 'Isi form di bawah ini untuk menambahkan pengguna baru.'}
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
            <DialogTitle>Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna{' '}
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
    </div>
  );
}

