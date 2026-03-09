"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function PublicationsManagement() {
  const { data: session } = useSession();
  const [data, setData] = useState<{publications: any[]}>({ publications: [] });
  const [loading, setLoading] = useState(true);

  // Alert Dialog State
  const [alertOpen, setAlertOpen] = useState(false);
  const [targetPub, setTargetPub] = useState<{ id: string; status: boolean; actionName: string; actionType: "approve" | "delete" } | null>(null);

  useEffect(() => {
    fetch("/api/publications?dashboard=true")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const requestApprovalToggle = (pubId: string, currentStatus: boolean) => {
    const actionName = currentStatus ? "mencabut ACC" : "menyetujui (ACC)";
    setTargetPub({ id: pubId, status: currentStatus, actionName, actionType: "approve" });
    setAlertOpen(true);
  };

  const toggleApproval = async () => {
    if (!targetPub) return;
    const { id: pubId, status: currentStatus } = targetPub;

    try {
      const res = await fetch(`/api/publications/${pubId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      
      if (!res.ok) throw new Error("Gagal mengubah status ACC publikasi");
      
      setData({
        ...data, 
        publications: data.publications.map((p: any) => p.id === pubId ? { ...p, isApproved: !currentStatus } : p)
      });
      toast.success(`Karya ilmiah berhasil ${!currentStatus ? 'di-ACC' : 'dicabut status ACC-nya'}`);
    } catch (err: Error | unknown) {
      toast.error((err as Error).message);
    } finally {
      setAlertOpen(false);
      setTargetPub(null);
    }
  };

  const requestDelete = (pubId: string) => {
    setTargetPub({ id: pubId, status: false, actionName: "menghapus", actionType: "delete" });
    setAlertOpen(true);
  };

  const deletePublication = async () => {
    if (!targetPub) return;
    const { id: pubId } = targetPub;

    try {
      const res = await fetch(`/api/publications/${pubId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus publikasi");
      
      setData({
        ...data,
        publications: data.publications.filter((p: any) => p.id !== pubId)
      });
      toast.success("Karya ilmiah berhasil dihapus secara permanen");
    } catch (err: Error | unknown) {
      toast.error((err as Error).message);
    } finally {
      setAlertOpen(false);
      setTargetPub(null);
    }
  };

  const handleActionConfirm = async () => {
    if (targetPub?.actionType === "approve") {
      await toggleApproval();
    } else if (targetPub?.actionType === "delete") {
      await deletePublication();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Karya Ilmiah</h1>
          <p className="text-muted-foreground">Kelola semua dokumen yang ada di reposituri.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/publications/new">
            <Plus className="mr-2 h-4 w-4" /> Tambah Baru
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead>Status ACC</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : data.publications.length > 0 ? (
              data.publications.map((pub: any) => (
                <TableRow key={pub.id}>
                  <TableCell className="font-medium max-w-[300px] truncate" title={pub.title}>{pub.title}</TableCell>
                  <TableCell>{pub.author.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{pub.type}</Badge>
                  </TableCell>
                  <TableCell>{pub.year}</TableCell>
                  <TableCell>
                    <Badge variant={pub.isApproved ? "outline" : "secondary"} className={pub.isApproved ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}>
                      {pub.isApproved ? "Di-ACC" : "Menunggu"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {session?.user?.role === "ADMIN" && (
                      <Button 
                          variant={pub.isApproved ? "outline" : "default"} 
                          size="sm"
                          onClick={() => requestApprovalToggle(pub.id, pub.isApproved)}
                          className="mr-2"
                        >
                          {pub.isApproved ? "Cabut ACC" : "ACC"}
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/repository/${pub.id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {session?.user?.role === "ADMIN" ? (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/publications/${pub.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" disabled>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {session?.user?.role === "ADMIN" ? (
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => requestDelete(pub.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="text-destructive " disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Belum ada dokumen yang diunggah.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {targetPub?.actionName} karya ilmiah ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleActionConfirm}>Ya, Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
