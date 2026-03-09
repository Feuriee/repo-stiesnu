export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle2, BookOpen, Calendar } from "lucide-react";

export default async function AuthorProfilePage({ params }: { params: { id: string } }) {
  const author = await prisma.author.findUnique({
    where: { id: params.id },
    include: {
      publications: {
        orderBy: { year: 'desc' }
      }
    }
  });

  if (!author) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Author Info Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="shadow-sm border-t-4 border-t-secondary text-center">
            <CardContent className="pt-8 pb-6 flex flex-col items-center">
              <UserCircle2 className="h-24 w-24 text-muted-foreground mb-4 opacity-50" />
              <h1 className="text-2xl font-bold text-primary">{author.name}</h1>
              {author.affiliation && (
                <p className="text-muted-foreground mt-1 text-sm">{author.affiliation}</p>
              )}
              
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground border-t pt-4 w-full justify-center">
                <BookOpen className="h-4 w-4" />
                <span>{author.publications.length} Karya Ilmiah Terpublikasi</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Publications List */}
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">Daftar Karya Ilmiah</h2>
          
          {author.publications.length > 0 ? (
            <div className="space-y-4">
              {author.publications.map((pub: any) => (
                <Card key={pub.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="bg-primary/5 p-3 rounded-lg hidden sm:block">
                      <BookOpen className="h-6 w-6 text-primary/60" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Link href={`/repository/${pub.id}`} className="hover:underline">
                        <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors">
                          {pub.title}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="font-normal">{pub.type}</Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{pub.year}</span>
                        </div>
                        {pub.programStudy && (
                          <span>Prodi: {pub.programStudy}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Belum ada karya ilmiah yang diunggah.</p>
          )}
        </div>
        
      </div>
    </div>
  );
}
