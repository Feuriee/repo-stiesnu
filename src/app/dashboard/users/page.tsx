"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function UsersManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Alert Dialog State
  const [alertOpen, setAlertOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<{ id: string; status: boolean; actionName: string } | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch users");
        }
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error(err);
        setError(err.message);
        toast.error("Gagal mengambil data", { description: err.message });
      })
      .finally(() => setLoading(false));
  }, []);

  const requestApprovalToggle = (userId: string, currentStatus: boolean) => {
    const actionName = currentStatus ? "mencabut akses" : "menyetujui (ACC)";
    setTargetUser({ id: userId, status: currentStatus, actionName });
    setAlertOpen(true);
  };

  const toggleApproval = async () => {
    if (!targetUser) return;
    const { id: userId, status: currentStatus } = targetUser;

    try {
      const res = await fetch(`/api/users/${userId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      
      if (!res.ok) throw new Error("Gagal mengubah status ACC");
      
      setUsers(users.map(u => u.id === userId ? { ...u, isApproved: !currentStatus } : u));
      toast.success(`Akun berhasil ${!currentStatus ? 'di-ACC' : 'dicabut aksesnya'}`);
    } catch (err: Error | unknown) {
      toast.error((err as Error).message);
    } finally {
      setAlertOpen(false);
      setTargetUser(null);
    }
  };

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Akses Ditolak</h2>
        <p className="text-muted-foreground mt-2">Halaman ini hanya dapat diakses oleh Administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
        <p className="text-muted-foreground">Kelola akun administrator, dosen, dan mahasiswa serta approval akun.</p>
      </div>

      {error ? (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead>Status ACC</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isApproved ? "outline" : "destructive"} className={user.isApproved ? "bg-emerald-50 text-emerald-600 border-emerald-200" : ""}>
                        {user.isApproved ? "Di-ACC" : "Tertunda"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role !== "ADMIN" && (
                        <Button 
                          variant={user.isApproved ? "outline" : "default"} 
                          size="sm"
                          onClick={() => requestApprovalToggle(user.id, user.isApproved)}
                        >
                          {user.isApproved ? "Cabut Akses" : "Setujui (ACC)"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Belum ada pengguna.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {targetUser?.actionName} akun ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={toggleApproval}>Ya, Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
