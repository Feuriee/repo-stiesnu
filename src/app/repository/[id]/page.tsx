export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Calendar, GraduationCap, Download, ArrowLeft, FileText } from "lucide-react";

export default async function PublicationDetailPage({ params }: { params: { id: string } }) {
  const pub = await prisma.publication.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      keywords: { include: { keyword: true } },
    }
  });

  if (!pub) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/repository">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Koleksi
          </Link>
        </Button>
      </div>

      <Card className="border-t-4 border-t-primary shadow-md overflow-hidden">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">{pub.type}</Badge>
            {pub.programStudy && <Badge variant="outline">{pub.programStudy}</Badge>}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
            {pub.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8 pb-8 border-b">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Penulis</p>
                <Link href={`/author/${pub.author.id}`} className="font-semibold text-primary hover:underline">
                  {pub.author.name}
                </Link>
                {pub.author.affiliation && (
                  <p className="text-xs text-muted-foreground">{pub.author.affiliation}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tahun Terbit</p>
                <p className="font-semibold">{pub.year}</p>
              </div>
            </div>

            {pub.programStudy && (
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Program Studi</p>
                  <p className="font-semibold">{pub.programStudy}</p>
                </div>
              </div>
            )}
            
            {(pub.keywords && pub.keywords.length > 0) && (
              <div className="col-span-1 md:col-span-2 mt-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Kata Kunci</p>
                <div className="flex flex-wrap gap-1.5">
                  {pub.keywords.map((k: any) => (
                    <Badge key={k.keywordId} variant="secondary" className="font-normal text-xs font-mono">
                      {k.keyword.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 border-l-4 border-secondary pl-3">Abstrak</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-justify">
              {pub.abstract}
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-6 border flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-xs">{pub.pdfUrl ? pub.pdfUrl.split('/').pop() : "Dokumen File"}</p>
                <p className="text-xs text-muted-foreground">PDF Document</p>
              </div>
            </div>
            {pub.pdfUrl ? (
              <Button asChild className="w-full md:w-auto shadow-sm">
                <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Unduh Dokumen FullText
                </a>
              </Button>
            ) : (
              <Button disabled variant="outline" className="w-full md:w-auto">
                <FileText className="mr-2 h-4 w-4" /> Dokumen Tidak Tersedia
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
