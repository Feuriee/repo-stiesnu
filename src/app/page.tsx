"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Search, Users, FileText, ChevronRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalPublications: 0,
    totalAuthors: 0,
    publicationsByType: [] as { name: string; value: number }[],
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.totalPublications !== undefined) {
          setStats(data);
        }
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/repository?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Glassmorphism & Gradient */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80 dark:from-background dark:via-background dark:to-background">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pattern-dots" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Portal Resmi STIESNU Bengkulu
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-md">
              Jelajahi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Karya Ilmiah</span> & Masa Depan
            </motion.h1>
            
            <motion.p variants={fadeIn} className="max-w-[700px] text-white/90 md:text-xl font-light leading-relaxed">
              Akses ribuan manuskrip, jurnal, skripsi, dan riset akademik dari civitas akademika Sekolah Tinggi Ilmu Ekonomi Syariah Nahdlatul Ulama Bengkulu.
            </motion.p>
            
            <motion.div variants={fadeIn} className="w-full max-w-2xl mt-8">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <Input
                    className="w-full bg-white/10 border-none text-white placeholder:text-white/60 pl-12 h-14 rounded-xl focus-visible:ring-1 focus-visible:ring-white/30 text-lg"
                    placeholder="Cari judul penelitian, abstrak, atau penulis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 rounded-xl bg-white text-primary hover:bg-white/90 font-bold shadow-lg transition-all hover:scale-105">
                  Eksplorasi
                </Button>
              </form>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-white/80">
                <span className="font-medium">Populer:</span>
                {['Ekonomi Syariah', 'Perbankan', 'Zakat', 'Fintech'].map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/repository?search=${tag.toLowerCase()}`}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors backdrop-blur-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Hover Effects */}
      <section className="w-full py-16 bg-muted/30 relative z-20 -mt-8">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { title: "Total Dokumen", value: stats.totalPublications, desc: "Karya ilmiah tersimpan", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "Total Penulis", value: stats.totalAuthors, desc: "Civitas akademika", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              ...((stats.publicationsByType.length > 0 ? stats.publicationsByType.slice(0, 2) : [
                { name: "Skripsi", value: 0 },
                { name: "Jurnal", value: 0 }
              ]).map(t => ({ title: t.name, value: t.value, desc: "Dokumen tersedia", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" })))
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn} whileHover={{ y: -5 }} className="h-full">
                <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm hover:shadow-md transition-all h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${stat.bg}`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-3xl font-bold tracking-tight mt-1">{stat.value}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="w-full py-20 bg-background relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                Koleksi Pilihan
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Temukan Berdasarkan Kategori</h2>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Eksplorasi literatur berdasarkan tipe publikasi. Temukan referensi terbaik untuk riset Anda berikutnya.
              </p>
            </div>
            <Button asChild variant="outline" className="group rounded-xl">
              <Link href="/repository">
                Lihat Semua Koleksi 
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { title: "Skripsi & Tesis", count: stats.publicationsByType.find(t => t.name.toLowerCase().includes('skripsi'))?.value || 0, href: "/repository?type=Skripsi" },
              { title: "Artikel Jurnal", count: stats.publicationsByType.find(t => t.name.toLowerCase().includes('jurnal'))?.value || 0, href: "/repository?type=Jurnal" },
              { title: "Prosiding", count: stats.publicationsByType.find(t => t.name.toLowerCase().includes('prosiding'))?.value || 0, href: "/repository?type=Prosiding" },
              { title: "Laporan Penelitian", count: stats.publicationsByType.find(t => t.name.toLowerCase().includes('laporan'))?.value || 0, href: "/repository?type=Laporan Penelitian" },
              { title: "Buku Ajar", count: stats.publicationsByType.find(t => t.name.toLowerCase().includes('buku'))?.value || 0, href: "/repository?type=Buku Ajar dosen" }
            ].map((cat, i) => (
              <motion.div key={i} variants={fadeIn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href={cat.href} className="block h-full">
                  <Card className="h-full hover:shadow-lg transition-all border-border/50 bg-gradient-to-br from-card to-card/50 overflow-hidden relative group rounded-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BookOpen className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
                    </div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{cat.title}</CardTitle>
                      <CardDescription className="text-base mt-2 flex items-center">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium mr-2">
                          {cat.count}
                        </span>
                        dokumen tersedia
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
