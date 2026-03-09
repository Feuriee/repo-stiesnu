export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-8 md:py-12 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg text-primary">STIESNU Bengkulu</h3>
          <p className="text-sm text-muted-foreground w-full md:max-w-xs text-balance">
            Sekolah Tinggi Ilmu Ekonomi Syariah Nahdlatul Ulama Bengkulu.
            Mengabdi untuk ilmu dan agama.
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-2 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} STIESNU Bengkulu Repository. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline hover:text-primary">Tentang Kami</a>
            <a href="#" className="hover:underline hover:text-primary">Kontak</a>
            <a href="#" className="hover:underline hover:text-primary">Bantuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
