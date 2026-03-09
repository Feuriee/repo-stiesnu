"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BookOpen, LogOut, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold inline-block text-primary text-xl tracking-tight hidden sm:inline-block">Reposituri STIESNU</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Beranda</Link>
            <Link href="/repository" className="transition-colors hover:text-foreground/80 text-foreground/60">Koleksi</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {session ? (
            <div className="flex items-center gap-3">
              {(session.user.role === "ADMIN" || session.user.role === "DOSEN") && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              )}
              <div className="hidden md:flex flex-col items-end text-xs">
                <span className="font-medium">{session.user.name}</span>
                <span className="text-muted-foreground">{session.user.role}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              {/* Optional: Add register link if public registration is needed */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
