"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, User, Calendar, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function RepositoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filterType, setFilterType] = useState(searchParams.get("type") || "all");
  const [filterYear, setFilterYear] = useState(searchParams.get("year") || "all");
  
  const [data, setData] = useState<{ publications: Array<any>, totalPages: number, page: number, total?: number }>({ publications: [], totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchParams.get("search")) params.append("search", searchParams.get("search") as string);
    if (searchParams.get("type") && searchParams.get("type") !== "all") params.append("type", searchParams.get("type") as string);
    if (searchParams.get("year") && searchParams.get("year") !== "all") params.append("year", searchParams.get("year") as string);
    params.append("page", currentPage.toString());

    try {
      const res = await fetch(`/api/publications?${params.toString()}`);
      const json = await res.json();
      if (json.publications) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set("search", searchTerm);
    else params.delete("search");
    
    if (filterType !== "all") params.set("type", filterType);
    else params.delete("type");
    
    if (filterYear !== "all") params.set("year", filterYear);
    else params.delete("year");
    
    params.set("page", "1");
    router.push(`/repository?${params.toString()}`);
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`/repository?${params.toString()}`);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-primary">Koleksi Repository</h1>
        <p className="text-muted-foreground">Telusuri seluruh karya ilmiah STIESNU Bengkulu</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6 shrink-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Filter Pencarian</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateSearch} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kata Kunci</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Cari judul/penulis" 
                      className="pl-8" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Jenis Karya</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenis</SelectItem>
                      <SelectItem value="Skripsi">Skripsi</SelectItem>
                      <SelectItem value="Jurnal">Jurnal</SelectItem>
                      <SelectItem value="Prosiding">Prosiding</SelectItem>
                      <SelectItem value="Laporan Penelitian">Laporan Penelitian</SelectItem>
                      <SelectItem value="Buku Ajar dosen">Buku Ajar Dosen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tahun</label>
                  <Input 
                    placeholder="Contoh: 2023" type="number" 
                    value={filterYear === "all" ? "" : filterYear}
                    onChange={(e) => setFilterYear(e.target.value || "all")}
                  />
                </div>

                <Button type="submit" className="w-full">Terapkan Filter</Button>
                {(searchTerm || filterType !== "all" || filterYear !== "all") && (
                   <Button variant="ghost" className="w-full" type="button" onClick={() => {
                     setSearchTerm(""); setFilterType("all"); setFilterYear("all");
                     router.push("/repository");
                   }}>Reset Filter</Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Menampilkan {data.publications.length} dari {data.total || 0} hasil</span>
          </div>

          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <Card key={i} className="mb-4">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          ) : data.publications.length > 0 ? (
            data.publications.map((pub: any) => (
              <Card key={pub.id} className="transition-all hover:bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center mb-1">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{pub.type}</Badge>
                      {pub.programStudy && <Badge variant="outline">{pub.programStudy}</Badge>}
                    </div>
                    
                    <Link href={`/repository/${pub.id}`} className="hover:underline">
                      <h2 className="text-xl font-bold text-primary">{pub.title}</h2>
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <Link href={`/author/${pub.author.id}`} className="hover:text-primary hover:underline">
                          {pub.author.name}
                        </Link>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{pub.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>PDF Available</span>
                      </div>
                    </div>
                    
                    <p className="text-sm mt-3 line-clamp-3 text-muted-foreground">
                      {pub.abstract}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada hasil yang ditemukan.</p>
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button 
                variant="outline" size="sm" 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnnya
              </Button>
              <div className="text-sm">
                Hal {currentPage} dari {data.totalPages}
              </div>
              <Button 
                variant="outline" size="sm" 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= data.totalPages}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RepositoryPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 max-w-6xl text-center">Memuat data repositori...</div>}>
      <RepositoryContent />
    </Suspense>
  );
}
