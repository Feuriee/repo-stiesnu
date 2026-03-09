import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "STIESNU Repository",
    template: "%s | STIESNU Repository",
  },
  description: "Repository Resmi Karya Ilmiah Sekolah Tinggi Ilmu Ekonomi Syariah Nahdlatul Ulama (STIESNU) Bengkulu.",
  keywords: ["STIESNU", "Repository", "Karya Ilmiah", "Skripsi", "Tesis", "Jurnal", "Bengkulu", "Ekonomi Syariah"],
  authors: [{ name: "STIESNU Bengkulu" }],
  openGraph: {
    title: "STIESNU Repository",
    description: "Repository Resmi Karya Ilmiah STIESNU Bengkulu.",
    url: "https://repository.stiesnu.ac.id",
    siteName: "STIESNU Repository",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
