"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Gagal Masuk", { description: result.error });
      } else {
        toast.success("Berhasil Masuk");
        router.refresh();
        router.push("/dashboard");
      }
    } catch {
      toast.error("Terjadi Kesalahan", { description: "Gagal menyambung ke server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 mx-auto">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <BookOpen className="h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            Masuk ke Reposituri
          </CardTitle>
          <CardDescription>
            Masukkan email dan password Anda untuk masuk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full mt-6" type="submit" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4">
          <div className="text-sm text-center text-muted-foreground w-full">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Daftar disini
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
