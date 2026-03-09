"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function UploadPublicationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Alert Dialog State
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<React.FormEvent | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    authorName: session?.user?.name || "",
    authorAffiliation: "STIESNU Bengkulu",
    abstract: "",
    year: new Date().getFullYear().toString(),
    programStudy: "",
    type: "",
    keywords: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Format tidak didukung", { description: "Hanya file PDF yang diperbolehkan." });
        setFile(null);
        e.target.value = '';
      } else {
        setFile(selectedFile);
      }
    }
  };

  const requestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.programStudy) {
      toast.error("Data tidak lengkap", { description: "Pilih Jenis Karya dan Program Studi." });
      return;
    }
    setPendingEvent(e);
    setAlertOpen(true);
  };

  const handleSubmit = async () => {
    if (!pendingEvent) return;

    setAlertOpen(false);
    setLoading(true);

    try {
      let pdfUrl = null;

      // Upload file if exists
      if (file) {
        const fileData = new FormData();
        fileData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });

        if (!uploadRes.ok) {
          throw new Error("Gagal mengunggah file");
        }

        const uploadJson = await uploadRes.json();
        pdfUrl = uploadJson.fileUrl;
      }

      // Create Publication Record
      const pubRes = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pdfUrl,
        }),
      });

      if (!pubRes.ok) {
        throw new Error("Gagal menyimpan data publikasi");
      }

      toast.success("Berhasil", { description: "Karya ilmiah berhasil diunggah." });
      router.push("/dashboard/publications");
      router.refresh();

    } catch (error: Error | unknown) {
      console.error(error);
      toast.error("Terjadi Kesalahan", { description: (error as Error).message || "Gagal menghubungi server." });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/publications">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Unggah Karya Ilmiah</h1>
          <p className="text-muted-foreground">Isi form di bawah ini untuk menambahkan dokumen baru.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metadata Dokumen</CardTitle>
          <CardDescription>Informasi detail mengenai karya ilmiah</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={requestSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Judul Karya Ilmiah <span className="text-destructive">*</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="Masukkan judul lengkap" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="authorName">Nama Penulis <span className="text-destructive">*</span></Label>
                  <Input id="authorName" name="authorName" value={formData.authorName} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="authorAffiliation">Afiliasi/Institusi</Label>
                  <Input id="authorAffiliation" name="authorAffiliation" value={formData.authorAffiliation} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Jenis Karya <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(val) => handleSelectChange("type", val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Jenis Karya" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Skripsi">Skripsi</SelectItem>
                      <SelectItem value="Tesis">Tesis</SelectItem>
                      <SelectItem value="Jurnal">Jurnal</SelectItem>
                      <SelectItem value="Prosiding">Prosiding</SelectItem>
                      <SelectItem value="Laporan Penelitian">Laporan Penelitian</SelectItem>
                      <SelectItem value="Buku Ajar dosen">Buku Ajar Dosen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Tahun Terbit <span className="text-destructive">*</span></Label>
                  <Input id="year" name="year" type="number" min="1900" max={new Date().getFullYear()} value={formData.year} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="programStudy">Program Studi <span className="text-destructive">*</span></Label>
                  <Select onValueChange={(val) => handleSelectChange("programStudy", val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Program Studi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ekonomi Syariah">Ekonomi Syariah</SelectItem>
                      <SelectItem value="Perbankan Syariah">Perbankan Syariah</SelectItem>
                      <SelectItem value="Manajemen Bisnis Syariah">Manajemen Bisnis Syariah</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="keywords">Kata Kunci</Label>
                  <Input id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} placeholder="Pisahkan dengan koma (contoh: zakat, inflasi, ekonomi)" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="abstract">Abstrak <span className="text-destructive">*</span></Label>
                <Textarea id="abstract" name="abstract" value={formData.abstract} onChange={handleChange} required rows={6} placeholder="Tuliskan abstrak karya ilmiah..." />
              </div>

              <div className="grid gap-2 p-4 border rounded-md bg-muted/20">
                <Label htmlFor="file" className="text-base flex items-center gap-2">
                  <UploadIcon className="h-4 w-4" /> Unggah File PDF
                </Label>
                <p className="text-xs text-muted-foreground mb-2">Opsional, tinggalkan kosong jika dokumen fisik.</p>
                <Input id="file" type="file" accept="application/pdf" onChange={handleFileChange} className="bg-background cursor-pointer" />
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/publications">Batal</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Dokumen"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin data karya ilmiah sudah benar dan ingin mengunggahnya?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Ya, Unggah</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
