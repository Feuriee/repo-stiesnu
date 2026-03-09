"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Gagal Mendaftar", { description: data.message });
      } else {
        toast.success("Berhasil Mendaftar", { description: "Silakan login dengan akun baru Anda." });
        router.push("/login");
      }
    } catch {
      toast.error("Terjadi Kesalahan", { description: "Gagal menyambung ke server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 mx-auto">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-secondary">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <BookOpen className="h-10 w-10 text-secondary mb-2" />
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            Daftar Akun Baru
          </CardTitle>
          <CardDescription>
            Buat akun untuk dapat mengakses layanan penuh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Ahmad Fulan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@stiesnu.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button className="w-full mt-6" type="submit" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4">
          <div className="text-sm text-center text-muted-foreground w-full">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Masuk disini
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
