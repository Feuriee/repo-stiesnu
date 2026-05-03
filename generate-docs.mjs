import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, TableRow, TableCell, Table, WidthType,
  BorderStyle, ShadingType, PageBreak, TabStopPosition
} from 'docx';
import fs from 'fs';

// ── Helper Functions ──────────────────────────────────────────────────────
const FONT = 'Times New Roman';
const COLOR_PRIMARY = '1B3A5C'; // dark navy
const COLOR_ACCENT = '2E86AB'; // teal accent
const COLOR_TABLE_HEADER = '1B3A5C';
const COLOR_TABLE_HEADER_TEXT = 'FFFFFF';
const COLOR_TABLE_ALT = 'F0F4F8';

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: 28, color: COLOR_PRIMARY }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({ text, bold: true, font: FONT, size: 24, color: COLOR_ACCENT }),
    ],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({ text, bold: true, font: FONT, size: 22, color: COLOR_PRIMARY }),
    ],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    indent: opts.indent ? { firstLine: 720 } : undefined,
    children: [
      new TextRun({ text, font: FONT, size: 24, ...opts }),
    ],
  });
}

function paraRuns(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    indent: opts.indent ? { firstLine: 720 } : undefined,
    children: runs.map(r => new TextRun({ font: FONT, size: 24, ...r })),
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    spacing: { after: 80, line: 360 },
    bullet: { level },
    children: [new TextRun({ text, font: FONT, size: 24 })],
  });
}

function bulletRuns(runs, level = 0) {
  return new Paragraph({
    spacing: { after: 80, line: 360 },
    bullet: { level },
    children: runs.map(r => new TextRun({ font: FONT, size: 24, ...r })),
  });
}

function numberedPara(text, level = 0) {
  return new Paragraph({
    spacing: { after: 80, line: 360 },
    numbering: { reference: 'numbered-list', level },
    children: [new TextRun({ text, font: FONT, size: 24 })],
  });
}

function numberedParaRuns(runs, level = 0) {
  return new Paragraph({
    spacing: { after: 80, line: 360 },
    numbering: { reference: 'numbered-list', level },
    children: runs.map(r => new TextRun({ font: FONT, size: 24, ...r })),
  });
}

function emptyPara() {
  return new Paragraph({ spacing: { after: 80 }, children: [] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

const thinBorder = {
  top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
};

function headerCell(text, widthPct) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: COLOR_TABLE_HEADER },
    borders: thinBorder,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text, bold: true, font: FONT, size: 20, color: COLOR_TABLE_HEADER_TEXT })],
      }),
    ],
  });
}

function dataCell(text, widthPct, isAlt = false) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: isAlt ? { type: ShadingType.SOLID, color: COLOR_TABLE_ALT } : undefined,
    borders: thinBorder,
    children: [
      new Paragraph({
        spacing: { before: 30, after: 30 },
        children: [new TextRun({ text, font: FONT, size: 20 })],
      }),
    ],
  });
}

function makeTable(headers, rows) {
  const colWidth = Math.floor(100 / headers.length);
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => headerCell(h, colWidth)),
  });
  const dataRows = rows.map((row, idx) =>
    new TableRow({
      children: row.map(cell => dataCell(cell, colWidth, idx % 2 === 1)),
    })
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

// ── Document Content ──────────────────────────────────────────────────────

function buildDocument() {
  const sections = [];

  // ═══════════════════ COVER PAGE ═══════════════════
  const coverSection = {
    properties: {},
    children: [
      emptyPara(), emptyPara(), emptyPara(), emptyPara(),
      emptyPara(), emptyPara(), emptyPara(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'DOKUMENTASI PROYEK', bold: true, font: FONT, size: 36, color: COLOR_PRIMARY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', font: FONT, size: 24, color: COLOR_ACCENT })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: 'REPOSITORI STIESNU BENGKULU', bold: true, font: FONT, size: 44, color: COLOR_PRIMARY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'Sistem Informasi Pengelolaan Karya Ilmiah', font: FONT, size: 26, italics: true, color: COLOR_ACCENT })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', font: FONT, size: 24, color: COLOR_ACCENT })],
      }),
      emptyPara(), emptyPara(), emptyPara(), emptyPara(),
      emptyPara(), emptyPara(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'Versi Dokumen: 1.0', font: FONT, size: 22 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'Tanggal: April 2026', font: FONT, size: 22 })],
      }),
      emptyPara(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'STIESNU BENGKULU', bold: true, font: FONT, size: 24, color: COLOR_PRIMARY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Sekolah Tinggi Ilmu Ekonomi Syariah Nahdlatul Ulama Bengkulu', font: FONT, size: 22, italics: true })],
      }),
    ],
  };
  sections.push(coverSection);

  // ═══════════════════ TABLE OF CONTENTS ═══════════════════
  const tocChildren = [
    heading1('Daftar Isi'),
    emptyPara(),
  ];
  const tocItems = [
    ['BAB 1', 'Deskripsi Umum Sistem', '1'],
    ['BAB 2', 'Latar Belakang Pengembangan', '3'],
    ['BAB 3', 'Tujuan dan Manfaat Sistem', '4'],
    ['BAB 4', 'Ruang Lingkup Sistem', '6'],
    ['BAB 5', 'Teknologi yang Digunakan', '7'],
    ['BAB 6', 'Arsitektur Sistem', '10'],
    ['BAB 7', 'Fitur Utama Sistem', '12'],
    ['BAB 8', 'Alur Kerja Sistem (Workflow)', '15'],
    ['BAB 9', 'Desain Database', '17'],
    ['BAB 10', 'API (Application Programming Interface)', '20'],
    ['BAB 11', 'Instalasi dan Konfigurasi Sistem', '24'],
    ['BAB 12', 'Panduan Penggunaan – Pengguna Umum', '27'],
    ['BAB 13', 'Panduan Penggunaan – Administrator', '29'],
    ['BAB 14', 'Keamanan Sistem', '31'],
    ['BAB 15', 'Kelebihan dan Keterbatasan Sistem', '33'],
    ['BAB 16', 'Rencana Pengembangan ke Depan', '35'],
  ];
  for (const [bab, title, page] of tocItems) {
    tocChildren.push(
      paraRuns([
        { text: `${bab}  `, bold: true },
        { text: `${title}`, },
        { text: `  .....  ${page}`, color: '999999' },
      ])
    );
  }
  sections.push({ children: tocChildren });

  // ═══════════════════ BAB 1: DESKRIPSI UMUM ═══════════════════
  const bab1 = [
    pageBreak(),
    heading1('BAB 1 – Deskripsi Umum Sistem'),
    emptyPara(),
    heading2('1.1 Gambaran Umum'),
    para('Repositori STIESNU Bengkulu adalah sebuah sistem informasi berbasis web yang dirancang dan dikembangkan untuk menyimpan, mengelola, dan menyediakan akses terhadap karya ilmiah di lingkungan Sekolah Tinggi Ilmu Ekonomi Syariah Nahdlatul Ulama (STIESNU) Bengkulu. Sistem ini berfungsi sebagai arsip digital terpusat yang memfasilitasi civitas akademika — baik dosen maupun mahasiswa — dalam mengunggah, mempublikasikan, dan mengarsipkan hasil karya ilmiah mereka secara terstruktur dan terpusat.', { indent: true }),
    para('Platform ini mendukung berbagai jenis karya ilmiah, meliputi skripsi, jurnal, artikel ilmiah, prosiding, laporan penelitian, serta buku ajar dosen. Dengan adanya sistem ini, seluruh karya ilmiah yang dihasilkan oleh civitas akademika STIESNU Bengkulu dapat terdokumentasi dengan baik, mudah dicari, dan dapat diakses oleh publik maupun internal institusi kapan saja dan dari mana saja melalui jaringan internet.', { indent: true }),

    heading2('1.2 Nama Sistem'),
    para('Nama resmi sistem ini adalah "Repositori STIESNU Bengkulu" atau disebut juga sebagai Repositori Karya Ilmiah STIESNU Bengkulu. Sistem dikembangkan secara internal dengan nama proyek teknis "repo-stiesnu".'),

    heading2('1.3 Pengguna Sistem'),
    para('Sistem ini dirancang untuk melayani beberapa kategori pengguna sebagai berikut:'),
    bulletRuns([{ text: 'Administrator (ADMIN): ', bold: true }, { text: 'Pengelola sistem yang memiliki hak akses penuh terhadap seluruh fitur, termasuk validasi pengguna baru, persetujuan publikasi, dan manajemen data pengguna.' }]),
    bulletRuns([{ text: 'Dosen (DOSEN): ', bold: true }, { text: 'Tenaga pengajar yang dapat mengunggah dan mengelola karya ilmiah pribadi seperti jurnal, buku ajar, dan laporan penelitian.' }]),
    bulletRuns([{ text: 'Mahasiswa (MAHASISWA): ', bold: true }, { text: 'Peserta didik yang dapat mengunggah karya ilmiah seperti skripsi dan laporan tugas akhir.' }]),
    bulletRuns([{ text: 'Tamu (GUEST): ', bold: true }, { text: 'Pengguna yang baru mendaftar dan belum mendapatkan persetujuan dari administrator. Peran default saat registrasi.' }]),
    bulletRuns([{ text: 'Pengunjung Publik: ', bold: true }, { text: 'Siapa saja yang mengakses website tanpa perlu login, dapat melihat dan menelusuri koleksi karya ilmiah yang telah disetujui (approved).' }]),
  ];
  sections.push({ children: bab1 });

  // ═══════════════════ BAB 2: LATAR BELAKANG ═══════════════════
  const bab2 = [
    pageBreak(),
    heading1('BAB 2 – Latar Belakang Pengembangan'),
    emptyPara(),
    heading2('2.1 Permasalahan'),
    para('Sebelum adanya sistem repositori digital, pengelolaan karya ilmiah di STIESNU Bengkulu masih dilakukan secara konvensional. Karya ilmiah seperti skripsi dan jurnal tersimpan dalam bentuk fisik (hardcopy) di perpustakaan atau dalam format digital yang tersebar di berbagai perangkat penyimpanan tanpa sistem pengelolaan yang terpadu. Hal ini menimbulkan beberapa permasalahan utama:', { indent: true }),
    numberedPara('Kesulitan dalam pencarian dan akses karya ilmiah oleh civitas akademika maupun pihak eksternal.'),
    numberedPara('Risiko kehilangan atau kerusakan dokumen fisik yang tidak memiliki cadangan digital terstruktur.'),
    numberedPara('Tidak adanya mekanisme validasi dan persetujuan secara digital untuk memastikan kualitas karya ilmiah yang dipublikasikan.'),
    numberedPara('Kurangnya visibilitas dan eksposur karya ilmiah STIESNU Bengkulu di tingkat nasional maupun internasional.'),
    numberedPara('Proses pendataan metadata karya ilmiah (judul, penulis, kata kunci, abstrak) yang tidak terstandarisasi.'),

    heading2('2.2 Solusi'),
    para('Berdasarkan permasalahan tersebut, dikembangkanlah sistem Repositori STIESNU Bengkulu sebagai solusi komprehensif. Sistem ini menyediakan platform digital terpusat yang memungkinkan seluruh karya ilmiah tersimpan, terindeks, dan dapat diakses secara efisien melalui antarmuka web yang modern dan responsif. Sistem juga dilengkapi dengan mekanisme alur persetujuan (approval workflow) untuk menjamin kualitas konten yang dipublikasikan.', { indent: true }),
  ];
  sections.push({ children: bab2 });

  // ═══════════════════ BAB 3: TUJUAN & MANFAAT ═══════════════════
  const bab3 = [
    pageBreak(),
    heading1('BAB 3 – Tujuan dan Manfaat Sistem'),
    emptyPara(),
    heading2('3.1 Tujuan Sistem'),
    para('Pengembangan sistem Repositori STIESNU Bengkulu memiliki beberapa tujuan strategis sebagai berikut:'),
    numberedPara('Menyediakan platform digital terpusat untuk penyimpanan dan pengelolaan seluruh karya ilmiah civitas akademika STIESNU Bengkulu.'),
    numberedPara('Memudahkan proses pencarian, akses, dan distribusi karya ilmiah melalui fitur pencarian dan filter yang komprehensif.'),
    numberedPara('Menerapkan sistem validasi dan persetujuan (approval) agar hanya karya ilmiah yang memenuhi standar dan telah diverifikasi yang dipublikasikan ke publik.'),
    numberedPara('Meningkatkan visibilitas dan daya jangkau karya ilmiah STIESNU Bengkulu melalui platform web yang dapat diakses secara global.'),
    numberedPara('Mendukung proses akreditasi institusi dengan menyediakan data karya ilmiah yang terstruktur dan terdokumentasi.'),
    numberedPara('Menyediakan dashboard statistik untuk memantau perkembangan produktivitas karya ilmiah.'),

    heading2('3.2 Manfaat Sistem'),
    heading3('A. Manfaat bagi Institusi'),
    bullet('Terciptanya arsip digital karya ilmiah yang terstruktur, aman, dan mudah dikelola.'),
    bullet('Mendukung pemenuhan persyaratan akreditasi terkait pengelolaan dan publikasi karya ilmiah.'),
    bullet('Meningkatkan reputasi akademik institusi melalui eksposur karya ilmiah secara daring.'),
    heading3('B. Manfaat bagi Dosen'),
    bullet('Kemudahan dalam mengunggah dan mempublikasikan hasil penelitian, jurnal, buku ajar, dan karya ilmiah lainnya.'),
    bullet('Portofolio karya ilmiah digital yang dapat diakses dan direferensikan kapan saja.'),
    heading3('C. Manfaat bagi Mahasiswa'),
    bullet('Akses mudah terhadap referensi karya ilmiah untuk keperluan penelitian dan penyusunan tugas akhir.'),
    bullet('Wadah untuk mempublikasikan skripsi dan karya ilmiah sehingga dapat direferensikan oleh pihak lain.'),
    heading3('D. Manfaat bagi Publik'),
    bullet('Akses terbuka terhadap karya ilmiah yang telah dipublikasikan untuk keperluan referensi dan studi literatur.'),
  ];
  sections.push({ children: bab3 });

  // ═══════════════════ BAB 4: RUANG LINGKUP ═══════════════════
  const bab4 = [
    pageBreak(),
    heading1('BAB 4 – Ruang Lingkup Sistem'),
    emptyPara(),
    heading2('4.1 Cakupan Fungsional'),
    para('Sistem Repositori STIESNU Bengkulu mencakup fungsionalitas berikut:'),
    numberedPara('Manajemen pengguna dengan sistem peran (role-based access control) meliputi Admin, Dosen, Mahasiswa, dan Guest.'),
    numberedPara('Registrasi pengguna baru dengan mekanisme persetujuan oleh administrator.'),
    numberedPara('Pengunggahan karya ilmiah dalam format PDF beserta metadata lengkap (judul, abstrak, penulis, tahun, program studi, kata kunci, dan tautan Google Scholar).'),
    numberedPara('Sistem persetujuan (approval) karya ilmiah oleh administrator sebelum dipublikasikan ke publik.'),
    numberedPara('Pencarian dan penelusuran koleksi karya ilmiah dengan filter berdasarkan tipe, program studi, penulis, dan kata kunci.'),
    numberedPara('Dashboard interaktif dengan statistik dan grafik untuk memantau jumlah publikasi, distribusi berdasarkan tipe dan tahun.'),
    numberedPara('Manajemen profil pengguna.'),

    heading2('4.2 Jenis Karya Ilmiah yang Didukung'),
    para('Sistem ini mendukung pengelolaan berbagai jenis karya ilmiah, meliputi:'),
    bullet('Skripsi'),
    bullet('Jurnal'),
    bullet('Artikel Ilmiah'),
    bullet('Prosiding'),
    bullet('Laporan Penelitian'),
    bullet('Buku Ajar Dosen'),

    heading2('4.3 Batasan Sistem'),
    bullet('Sistem saat ini dirancang untuk lingkup internal STIESNU Bengkulu dan belum terintegrasi dengan repositori nasional (misalnya GARUDA atau SINTA).'),
    bullet('Format dokumen yang didukung untuk unggahan hanya PDF dengan batas ukuran maksimal 50 MB per file.'),
    bullet('Sistem belum menyediakan fitur full-text search terhadap isi dokumen PDF (pencarian hanya berdasarkan metadata).'),
  ];
  sections.push({ children: bab4 });

  // ═══════════════════ BAB 5: TEKNOLOGI ═══════════════════
  const bab5 = [
    pageBreak(),
    heading1('BAB 5 – Teknologi yang Digunakan'),
    emptyPara(),
    para('Sistem Repositori STIESNU Bengkulu dibangun menggunakan arsitektur Client-Server modern yang memisahkan antara antarmuka pengguna (Frontend) dan logika bisnis serta basis data (Backend). Berikut adalah rincian teknologi yang digunakan pada setiap lapisan sistem.', { indent: true }),

    heading2('5.1 Frontend (Antarmuka Pengguna)'),
    para('Lapisan antarmuka pengguna dikembangkan menggunakan kerangka kerja (framework) modern untuk menghasilkan performa tinggi dan pengalaman pengguna yang responsif.'),
    makeTable(
      ['Komponen', 'Teknologi', 'Versi', 'Keterangan'],
      [
        ['Framework Utama', 'Vue.js 3', 'v3.5.x', 'Menggunakan Composition API'],
        ['Build Tool', 'Vite', 'v7.3.x', 'Hot Module Replacement (HMR)'],
        ['Type Checking', 'TypeScript + Vue TSC', 'v5.9.x', 'Static type checking'],
        ['CSS Framework', 'Tailwind CSS', 'v4.2.x', 'Utility-first CSS framework'],
        ['Routing', 'Vue Router', 'v5.0.x', 'Single Page Application routing'],
        ['State Management', 'Pinia', 'v3.0.x', 'State management bawaan Vue 3'],
        ['HTTP Client', 'Axios', 'v1.13.x', 'Komunikasi REST API'],
        ['Icon Library', 'Phosphor Icons', 'v2.2.x', 'Ikon modern dan konsisten'],
        ['Progress Bar', 'NProgress', 'v0.2.x', 'Indikator pemuatan navigasi halaman'],
        ['Grafik', 'ApexCharts + vue3-apexcharts', 'v5.10.x', 'Visualisasi data statistik'],
      ]
    ),

    heading2('5.2 Backend (API & Logika Bisnis)'),
    para('Lapisan backend menyediakan REST API dan menangani seluruh logika bisnis, autentikasi, serta manajemen file.'),
    makeTable(
      ['Komponen', 'Teknologi', 'Versi', 'Keterangan'],
      [
        ['Runtime', 'Node.js', 'v18+', 'JavaScript runtime environment'],
        ['Framework', 'Express.js', 'v5.2.x', 'Web framework minimalis'],
        ['Bahasa', 'TypeScript', 'v5.9.x', 'Strongly-typed JavaScript'],
        ['ORM', 'Prisma Client', 'v6.19.x', 'Object-Relational Mapping'],
        ['Autentikasi', 'JSON Web Token (JWT)', 'v9.0.x', 'Token-based authentication'],
        ['Hashing', 'bcrypt.js', 'v3.0.x', 'Hashing kata sandi'],
        ['File Upload', 'Multer', 'v2.1.x', 'Manajemen unggah file PDF'],
        ['Cookie Parsing', 'cookie-parser', 'v1.4.x', 'Parsing HTTP cookies'],
        ['CORS', 'cors', 'v2.8.x', 'Cross-Origin Resource Sharing'],
        ['Dev Tool', 'Nodemon', 'v3.1.x', 'Auto-restart saat development'],
      ]
    ),

    heading2('5.3 Database'),
    makeTable(
      ['Komponen', 'Teknologi', 'Keterangan'],
      [
        ['DBMS', 'MySQL', 'Sistem manajemen basis data relasional'],
        ['Schema Management', 'Prisma Migrate / Prisma DB Push', 'Sinkronisasi skema ke database'],
        ['GUI Tool', 'Prisma Studio', 'Manajemen data visual melalui browser'],
      ]
    ),
  ];
  sections.push({ children: bab5 });

  // ═══════════════════ BAB 6: ARSITEKTUR ═══════════════════
  const bab6 = [
    pageBreak(),
    heading1('BAB 6 – Arsitektur Sistem'),
    emptyPara(),
    heading2('6.1 Arsitektur Umum'),
    para('Sistem Repositori STIESNU Bengkulu mengadopsi arsitektur Client-Server dengan pola RESTful API. Arsitektur ini memisahkan secara jelas antara lapisan presentasi (frontend) dan lapisan logika bisnis (backend), sehingga memungkinkan pengembangan, pemeliharaan, dan skalabilitas yang independen pada masing-masing lapisan.', { indent: true }),

    heading2('6.2 Diagram Arsitektur'),
    para('Berikut merupakan gambaran arsitektur sistem dalam bentuk deskriptif:'),
    emptyPara(),
    para('┌─────────────────────────────────────────────────────────────────┐', { align: AlignmentType.LEFT }),
    para('│                    KLIEN (Browser Pengguna)                    │', { align: AlignmentType.LEFT }),
    para('│         ┌──────────────────────────────────────┐               │', { align: AlignmentType.LEFT }),
    para('│         │  Frontend (Vue.js 3 + Vite + Pinia)  │               │', { align: AlignmentType.LEFT }),
    para('│         │  - SPA (Single Page Application)     │               │', { align: AlignmentType.LEFT }),
    para('│         │  - Tailwind CSS                      │               │', { align: AlignmentType.LEFT }),
    para('│         │  - Axios HTTP Client                 │               │', { align: AlignmentType.LEFT }),
    para('│         └──────────────┬───────────────────────┘               │', { align: AlignmentType.LEFT }),
    para('└──────────────────────┬──────────────────────────────────────────┘', { align: AlignmentType.LEFT }),
    para('                       │  HTTP REST API (JSON)', { align: AlignmentType.LEFT }),
    para('                       │  + HTTP-Only Cookie (JWT)', { align: AlignmentType.LEFT }),
    para('┌──────────────────────┴──────────────────────────────────────────┐', { align: AlignmentType.LEFT }),
    para('│                    SERVER (Backend Express.js)                  │', { align: AlignmentType.LEFT }),
    para('│         ┌──────────────────────────────────────┐               │', { align: AlignmentType.LEFT }),
    para('│         │  - Routes (auth, users, publications)│               │', { align: AlignmentType.LEFT }),
    para('│         │  - Controllers (business logic)      │               │', { align: AlignmentType.LEFT }),
    para('│         │  - Middleware (auth, admin, CORS)     │               │', { align: AlignmentType.LEFT }),
    para('│         │  - Multer (File Upload Handler)      │               │', { align: AlignmentType.LEFT }),
    para('│         │  - Prisma ORM                        │               │', { align: AlignmentType.LEFT }),
    para('│         └──────────────┬───────────────────────┘               │', { align: AlignmentType.LEFT }),
    para('└──────────────────────┬──────────────────────────────────────────┘', { align: AlignmentType.LEFT }),
    para('                       │  Prisma Client Query', { align: AlignmentType.LEFT }),
    para('┌──────────────────────┴──────────────────────────────────────────┐', { align: AlignmentType.LEFT }),
    para('│                    DATABASE (MySQL)                             │', { align: AlignmentType.LEFT }),
    para('│         - User, Author, Publication, Keyword                   │', { align: AlignmentType.LEFT }),
    para('│         - PublicationKeyword (junction table)                   │', { align: AlignmentType.LEFT }),
    para('└─────────────────────────────────────────────────────────────────┘', { align: AlignmentType.LEFT }),
    emptyPara(),

    heading2('6.3 Struktur Direktori Proyek'),
    para('Proyek ini diorganisasi dalam struktur monorepo dengan pemisahan folder frontend dan backend:'),
    emptyPara(),
    para('repo-stiesnu/', { align: AlignmentType.LEFT, bold: true }),
    para('├── frontend/                    # Aplikasi Vue.js 3', { align: AlignmentType.LEFT }),
    para('│   ├── src/', { align: AlignmentType.LEFT }),
    para('│   │   ├── api/                 # Konfigurasi Axios', { align: AlignmentType.LEFT }),
    para('│   │   ├── assets/              # Aset statis', { align: AlignmentType.LEFT }),
    para('│   │   ├── components/          # Komponen Vue reusable', { align: AlignmentType.LEFT }),
    para('│   │   │   ├── layout/          # Navbar, Sidebar, Footer', { align: AlignmentType.LEFT }),
    para('│   │   │   └── ui/              # Button, Card, Input, dll.', { align: AlignmentType.LEFT }),
    para('│   │   ├── composables/         # Composable hooks (tema, toast)', { align: AlignmentType.LEFT }),
    para('│   │   ├── router/              # Konfigurasi Vue Router', { align: AlignmentType.LEFT }),
    para('│   │   ├── stores/              # Pinia stores (auth)', { align: AlignmentType.LEFT }),
    para('│   │   └── views/               # Halaman-halaman aplikasi', { align: AlignmentType.LEFT }),
    para('│   │       ├── auth/            # Login, Register', { align: AlignmentType.LEFT }),
    para('│   │       └── dashboard/       # Halaman dashboard', { align: AlignmentType.LEFT }),
    para('│   └── package.json', { align: AlignmentType.LEFT }),
    para('├── backend/                     # Aplikasi Express.js', { align: AlignmentType.LEFT }),
    para('│   ├── prisma/', { align: AlignmentType.LEFT }),
    para('│   │   ├── schema.prisma        # Definisi skema database', { align: AlignmentType.LEFT }),
    para('│   │   └── seed.ts              # Data seeding', { align: AlignmentType.LEFT }),
    para('│   ├── public/uploads/          # Direktori penyimpanan PDF', { align: AlignmentType.LEFT }),
    para('│   ├── src/', { align: AlignmentType.LEFT }),
    para('│   │   ├── controllers/         # Logika bisnis', { align: AlignmentType.LEFT }),
    para('│   │   ├── middleware/           # Autentikasi middleware', { align: AlignmentType.LEFT }),
    para('│   │   ├── routes/              # Definisi endpoint API', { align: AlignmentType.LEFT }),
    para('│   │   └── index.ts             # Entry point server', { align: AlignmentType.LEFT }),
    para('│   └── package.json', { align: AlignmentType.LEFT }),
    para('├── .env.example                 # Contoh konfigurasi', { align: AlignmentType.LEFT }),
    para('└── README.md                    # Dokumentasi proyek', { align: AlignmentType.LEFT }),
  ];
  sections.push({ children: bab6 });

  // ═══════════════════ BAB 7: FITUR UTAMA ═══════════════════
  const bab7 = [
    pageBreak(),
    heading1('BAB 7 – Fitur Utama Sistem'),
    emptyPara(),
    heading2('7.1 Fitur untuk Pengguna Umum (Publik)'),
    heading3('A. Halaman Beranda (Landing Page)'),
    bullet('Menampilkan informasi umum tentang repositori STIESNU Bengkulu.'),
    bullet('Statistik ringkas jumlah koleksi karya ilmiah yang tersedia.'),
    bullet('Navigasi menuju halaman koleksi repositori.'),

    heading3('B. Halaman Koleksi Repositori'),
    bullet('Menampilkan seluruh daftar karya ilmiah yang telah disetujui (approved) oleh administrator.'),
    bullet('Fitur pencarian berdasarkan judul, abstrak, atau nama penulis.'),
    bullet('Filter berdasarkan tipe karya ilmiah (Skripsi, Jurnal, Artikel Ilmiah, dll.) dan program studi.'),
    bullet('Paginasi data untuk navigasi yang efisien.'),
    bullet('Desain responsif yang dapat diakses optimal melalui perangkat desktop maupun mobile.'),

    heading3('C. Halaman Detail Publikasi'),
    bullet('Menampilkan informasi lengkap karya ilmiah: judul, penulis, abstrak, tahun, program studi, tipe, dan kata kunci.'),
    bullet('Tombol untuk mengunduh atau melihat file PDF karya ilmiah.'),
    bullet('Tautan referensi ke Google Scholar (jika tersedia).'),

    heading3('D. Registrasi Akun'),
    bullet('Formulir pendaftaran untuk civitas akademika dengan input nama, email, dan kata sandi.'),
    bullet('Akun baru secara default berstatus belum disetujui (pending) dan harus divalidasi oleh administrator.'),

    heading2('7.2 Fitur untuk Pengguna Terotentikasi (Dosen & Mahasiswa)'),
    heading3('A. Dashboard Overview'),
    bullet('Halaman beranda internal setelah login berhasil.'),
    bullet('Menampilkan statistik ringkas: total publikasi, publikasi menunggu persetujuan, jumlah penulis.'),
    bullet('Grafik visualisasi distribusi publikasi berdasarkan tipe dan tahun menggunakan ApexCharts.'),

    heading3('B. Manajemen Karya Ilmiah'),
    bullet('Daftar karya ilmiah milik pengguna yang sedang login.'),
    bullet('Status persetujuan karya ilmiah (Disetujui/Menunggu) ditampilkan secara visual.'),
    bullet('Kemampuan untuk menghapus karya ilmiah milik sendiri.'),

    heading3('C. Unggah Karya Ilmiah'),
    bullet('Formulir lengkap untuk mengunggah karya ilmiah baru dengan field: judul, abstrak, penulis, afiliasi penulis, tahun, program studi, tipe, kata kunci, tautan Google Scholar, dan file PDF.'),
    bullet('Validasi format file (hanya PDF) dengan batas ukuran maksimal 50 MB.'),
    bullet('Karya ilmiah yang diunggah secara default berstatus "Menunggu Persetujuan" (kecuali diunggah oleh admin).'),

    heading3('D. Profil Pengguna'),
    bullet('Halaman pengaturan profil untuk memperbarui nama, email, dan kata sandi.'),

    heading2('7.3 Fitur Khusus Administrator'),
    heading3('A. Manajemen Pengguna'),
    bullet('Melihat daftar seluruh pengguna terdaftar beserta informasi peran, status persetujuan, dan jumlah publikasi.'),
    bullet('Menyetujui atau menolak pendaftaran pengguna baru.'),
    bullet('Mengubah peran pengguna (GUEST, MAHASISWA, DOSEN, ADMIN).'),
    bullet('Menghapus akun pengguna.'),
    bullet('Membuat akun pengguna baru secara manual.'),

    heading3('B. Manajemen & Persetujuan Publikasi'),
    bullet('Melihat seluruh karya ilmiah termasuk yang belum disetujui.'),
    bullet('Fitur persetujuan (approve) atau penolakan karya ilmiah.'),
    bullet('Kemampuan untuk mengedit metadata karya ilmiah jika terdapat kesalahan.'),
    bullet('Kemampuan untuk mengunggah ulang file PDF.'),
    bullet('Menghapus karya ilmiah yang tidak sesuai.'),

    heading3('C. Statistik & Dashboard Admin'),
    bullet('Statistik lengkap: total publikasi, total penulis, total pengguna terverifikasi/belum terverifikasi.'),
    bullet('Distribusi pengguna berdasarkan peran (role).'),
    bullet('Grafik publikasi berdasarkan tipe dan tahun.'),
    bullet('Jumlah publikasi yang menunggu persetujuan.'),
  ];
  sections.push({ children: bab7 });

  // ═══════════════════ BAB 8: WORKFLOW ═══════════════════
  const bab8 = [
    pageBreak(),
    heading1('BAB 8 – Alur Kerja Sistem (Workflow)'),
    emptyPara(),
    heading2('8.1 Alur Registrasi dan Validasi Pengguna'),
    para('Proses registrasi pengguna baru pada sistem mengikuti alur sebagai berikut:'),
    numberedPara('Pengguna baru mengakses halaman registrasi (/register) dan mengisi formulir pendaftaran dengan data nama lengkap, alamat email, dan kata sandi.'),
    numberedPara('Sistem menyimpan data pengguna baru ke database dengan peran default GUEST dan status isApproved = false (belum disetujui).'),
    numberedPara('Pengguna baru belum dapat login ke sistem hingga mendapat persetujuan dari administrator.'),
    numberedPara('Administrator mengakses halaman Manajemen Pengguna (/dashboard/users) pada dashboard.'),
    numberedPara('Administrator melakukan verifikasi dan memberikan persetujuan (mengubah isApproved menjadi true) serta mengatur peran yang sesuai (DOSEN atau MAHASISWA).'),
    numberedPara('Setelah disetujui, pengguna dapat login dan mengakses fitur sesuai perannya.'),

    heading2('8.2 Alur Pengunggahan dan Persetujuan Karya Ilmiah'),
    para('Proses pengunggahan dan publikasi karya ilmiah mengikuti alur sebagai berikut:'),
    numberedPara('Pengguna terotentikasi (Dosen/Mahasiswa) login ke sistem dan mengakses halaman unggah karya ilmiah (/dashboard/publications/new).'),
    numberedPara('Pengguna mengisi formulir unggah dengan data metadata lengkap: judul, abstrak, nama penulis, afiliasi, tahun terbit, program studi, tipe karya ilmiah, kata kunci, URL Google Scholar (opsional), dan mengunggah file PDF.'),
    numberedPara('Sistem memproses unggahan: menyimpan file PDF ke direktori /public/uploads/ pada server, membuat atau menghubungkan record Author, membuat record Keyword, dan menyimpan data Publication ke database dengan status isApproved = false.'),
    numberedPara('Karya ilmiah dengan status "Menunggu Persetujuan" hanya dapat dilihat oleh pengunggah asli dan administrator.'),
    numberedPara('Administrator mengakses daftar karya ilmiah, meninjau detail dan konten dokumen yang diunggah.'),
    numberedPara('Jika konten telah memenuhi standar, administrator memberikan persetujuan (mengubah isApproved menjadi true).'),
    numberedPara('Setelah disetujui, karya ilmiah otomatis muncul di halaman Koleksi Repositori (/repository) dan dapat diakses oleh publik.'),
    para('Catatan: Jika karya ilmiah diunggah oleh pengguna dengan peran ADMIN, status persetujuan secara otomatis diatur ke true (auto-approved).', { italics: true }),

    heading2('8.3 Alur Pencarian Karya Ilmiah oleh Publik'),
    numberedPara('Pengunjung mengakses halaman Koleksi Repositori (/repository).'),
    numberedPara('Pengunjung dapat melakukan pencarian berdasarkan kata kunci judul, abstrak, atau nama penulis melalui kolom pencarian.'),
    numberedPara('Pengunjung dapat memfilter hasil berdasarkan tipe karya ilmiah dan program studi.'),
    numberedPara('Pengunjung memilih karya ilmiah dari daftar untuk melihat detail lengkap.'),
    numberedPara('Pengunjung dapat mengunduh file PDF atau mengakses tautan Google Scholar.'),

    heading2('8.4 Alur Autentikasi dan Sesi'),
    numberedPara('Pengguna memasukkan email dan kata sandi pada halaman login (/login).'),
    numberedPara('Backend memverifikasi kredensial: mencocokkan email di database dan membandingkan hash kata sandi menggunakan bcrypt.'),
    numberedPara('Jika valid dan akun telah disetujui, backend menghasilkan JSON Web Token (JWT) yang berisi informasi user ID, email, peran, dan nama.'),
    numberedPara('Token disimpan sebagai HTTP-Only cookie di browser klien dengan masa berlaku 7 hari.'),
    numberedPara('Setiap permintaan ke endpoint terproteksi akan melewati middleware autentikasi yang memvalidasi token dari cookie atau header Authorization.'),
    numberedPara('Saat logout, cookie token dihapus dari browser.'),
  ];
  sections.push({ children: bab8 });

  // ═══════════════════ BAB 9: DESAIN DATABASE ═══════════════════
  const bab9 = [
    pageBreak(),
    heading1('BAB 9 – Desain Database'),
    emptyPara(),
    heading2('9.1 Gambaran Umum'),
    para('Basis data sistem Repositori STIESNU Bengkulu menggunakan MySQL sebagai sistem manajemen basis data relasional (RDBMS). Skema database didefinisikan dan dikelola menggunakan Prisma ORM, yang memungkinkan sinkronisasi skema secara otomatis melalui perintah prisma db push. Database terdiri dari 5 (lima) tabel utama yang saling berelasi.', { indent: true }),

    heading2('9.2 Tabel User'),
    para('Tabel ini menyimpan data akun pengguna sistem.'),
    makeTable(
      ['Kolom', 'Tipe Data', 'Constraint', 'Keterangan'],
      [
        ['id', 'String (CUID)', 'PRIMARY KEY', 'Identitas unik pengguna, auto-generated'],
        ['name', 'String', 'NOT NULL', 'Nama lengkap pengguna'],
        ['email', 'String', 'UNIQUE, NOT NULL', 'Alamat email (digunakan untuk login)'],
        ['password', 'String', 'NOT NULL', 'Kata sandi ter-hash (bcrypt)'],
        ['role', 'Enum (Role)', 'DEFAULT: GUEST', 'Peran: ADMIN, DOSEN, MAHASISWA, GUEST'],
        ['isApproved', 'Boolean', 'DEFAULT: false', 'Status persetujuan akun oleh admin'],
        ['createdAt', 'DateTime', 'DEFAULT: now()', 'Waktu pembuatan akun'],
      ]
    ),
    para('Relasi: User memiliki relasi one-to-many terhadap Publication (sebagai uploader).'),

    heading2('9.3 Tabel Author'),
    para('Tabel ini menyimpan data penulis asli karya ilmiah.'),
    makeTable(
      ['Kolom', 'Tipe Data', 'Constraint', 'Keterangan'],
      [
        ['id', 'String (CUID)', 'PRIMARY KEY', 'Identitas unik penulis'],
        ['name', 'String', 'NOT NULL', 'Nama lengkap penulis'],
        ['affiliation', 'String', 'NULLABLE', 'Afiliasi/institusi penulis'],
        ['createdAt', 'DateTime', 'DEFAULT: now()', 'Waktu pembuatan record'],
      ]
    ),
    para('Relasi: Author memiliki relasi one-to-many terhadap Publication.'),

    heading2('9.4 Tabel Publication'),
    para('Tabel utama yang menyimpan data karya ilmiah.'),
    makeTable(
      ['Kolom', 'Tipe Data', 'Constraint', 'Keterangan'],
      [
        ['id', 'String (CUID)', 'PRIMARY KEY', 'Identitas unik publikasi'],
        ['title', 'String', 'NOT NULL', 'Judul karya ilmiah'],
        ['abstract', 'Text', 'NOT NULL', 'Abstrak karya ilmiah'],
        ['year', 'Integer', 'NOT NULL', 'Tahun terbit/penyelesaian'],
        ['programStudy', 'String', 'NOT NULL', 'Program studi terkait'],
        ['type', 'String', 'NOT NULL', 'Jenis: Skripsi, Jurnal, dll.'],
        ['pdfUrl', 'String', 'NULLABLE', 'Path file PDF yang diunggah'],
        ['scholarUrl', 'String', 'NULLABLE', 'URL Google Scholar'],
        ['isApproved', 'Boolean', 'DEFAULT: false', 'Status persetujuan admin'],
        ['createdAt', 'DateTime', 'DEFAULT: now()', 'Waktu pembuatan record'],
        ['authorId', 'String', 'FOREIGN KEY → Author', 'Referensi ke penulis asli'],
        ['uploaderId', 'String', 'FOREIGN KEY → User', 'Referensi ke pengunggah'],
      ]
    ),

    heading2('9.5 Tabel Keyword'),
    para('Tabel ini menyimpan daftar kata kunci unik yang digunakan sebagai tag karya ilmiah.'),
    makeTable(
      ['Kolom', 'Tipe Data', 'Constraint', 'Keterangan'],
      [
        ['id', 'String (CUID)', 'PRIMARY KEY', 'Identitas unik kata kunci'],
        ['name', 'String', 'UNIQUE', 'Teks kata kunci'],
      ]
    ),

    heading2('9.6 Tabel PublicationKeyword (Junction Table)'),
    para('Tabel penghubung yang mengimplementasikan relasi many-to-many antara Publication dan Keyword.'),
    makeTable(
      ['Kolom', 'Tipe Data', 'Constraint', 'Keterangan'],
      [
        ['publicationId', 'String', 'COMPOSITE PK, FK → Publication', 'Referensi ke publikasi'],
        ['keywordId', 'String', 'COMPOSITE PK, FK → Keyword', 'Referensi ke kata kunci'],
      ]
    ),
    para('Cascade Delete: Ketika sebuah Publication atau Keyword dihapus, record pada tabel junction ini akan otomatis terhapus (onDelete: Cascade).'),

    heading2('9.7 Relasi Antar Tabel (Entity Relationship)'),
    bullet('User (1) ──── (N) Publication: Satu pengguna dapat mengunggah banyak karya ilmiah.'),
    bullet('Author (1) ──── (N) Publication: Satu penulis dapat memiliki banyak karya ilmiah.'),
    bullet('Publication (N) ──── (N) Keyword: Satu karya ilmiah dapat memiliki banyak kata kunci, dan satu kata kunci dapat dimiliki oleh banyak karya ilmiah.'),
    bullet('Relasi many-to-many antara Publication dan Keyword diimplementasikan melalui tabel junction PublicationKeyword.'),
  ];
  sections.push({ children: bab9 });

  // ═══════════════════ BAB 10: API ═══════════════════
  const bab10 = [
    pageBreak(),
    heading1('BAB 10 – API (Application Programming Interface)'),
    emptyPara(),
    para('Backend menyediakan RESTful API yang diakses oleh frontend melalui HTTP. Seluruh endpoint menggunakan format JSON untuk pertukaran data. Base URL default: http://localhost:8000/api.', { indent: true }),

    heading2('10.1 Endpoint Autentikasi (/api/auth)'),
    makeTable(
      ['Method', 'Endpoint', 'Deskripsi', 'Autentikasi'],
      [
        ['POST', '/api/auth/register', 'Mendaftarkan pengguna baru', 'Tidak diperlukan'],
        ['POST', '/api/auth/login', 'Login dan mendapatkan JWT token', 'Tidak diperlukan'],
        ['POST', '/api/auth/logout', 'Logout dan menghapus cookie token', 'Tidak diperlukan'],
        ['GET', '/api/auth/session', 'Mengambil data sesi pengguna aktif', 'JWT diperlukan'],
      ]
    ),

    heading2('10.2 Endpoint Pengguna (/api/users)'),
    para('Seluruh endpoint pengguna memerlukan autentikasi. Beberapa endpoint memerlukan peran Administrator.'),
    makeTable(
      ['Method', 'Endpoint', 'Deskripsi', 'Autentikasi'],
      [
        ['GET', '/api/users', 'Mengambil daftar seluruh pengguna', 'Admin'],
        ['POST', '/api/users', 'Membuat pengguna baru', 'Admin'],
        ['PUT', '/api/users/:id', 'Memperbarui data pengguna', 'Admin / Self'],
        ['PATCH', '/api/users/:id/approve', 'Menyetujui/mengubah status pengguna', 'Admin'],
        ['DELETE', '/api/users/:id', 'Menghapus pengguna', 'Admin'],
      ]
    ),

    heading2('10.3 Endpoint Publikasi (/api/publications)'),
    makeTable(
      ['Method', 'Endpoint', 'Deskripsi', 'Autentikasi'],
      [
        ['GET', '/api/publications', 'Mengambil daftar publikasi (approved untuk publik, semua untuk admin)', 'Opsional'],
        ['GET', '/api/publications/:id', 'Mengambil detail publikasi tertentu', 'Opsional'],
        ['POST', '/api/publications', 'Mengunggah karya ilmiah baru (multipart/form-data)', 'Non-Guest'],
        ['PUT', '/api/publications/:id', 'Memperbarui data publikasi', 'Admin / Uploader'],
        ['DELETE', '/api/publications/:id', 'Menghapus publikasi', 'Admin / Uploader'],
        ['PATCH', '/api/publications/:id/approve', 'Mengubah status persetujuan publikasi', 'Admin'],
      ]
    ),

    heading2('10.4 Endpoint Statistik'),
    makeTable(
      ['Method', 'Endpoint', 'Deskripsi', 'Autentikasi'],
      [
        ['GET', '/api/stats', 'Mengambil data statistik sistem', 'Tidak diperlukan'],
      ]
    ),

    heading2('10.5 Endpoint Upload File'),
    makeTable(
      ['Method', 'Endpoint', 'Deskripsi', 'Autentikasi'],
      [
        ['POST', '/api/upload', 'Mengunggah file PDF standalone', 'Tidak diperlukan'],
      ]
    ),

    heading2('10.6 Endpoint Health Check'),
    makeTable(
      ['Method', 'Endpoint', 'Deskripsi', 'Autentikasi'],
      [
        ['GET', '/api/health', 'Memeriksa status server backend', 'Tidak diperlukan'],
      ]
    ),

    heading2('10.7 Query Parameters pada GET /api/publications'),
    makeTable(
      ['Parameter', 'Tipe', 'Keterangan'],
      [
        ['search', 'String', 'Pencarian berdasarkan judul, abstrak, atau nama penulis'],
        ['type', 'String', 'Filter berdasarkan tipe karya ilmiah'],
        ['programStudy', 'String', 'Filter berdasarkan program studi'],
        ['author', 'String', 'Filter berdasarkan nama penulis'],
        ['isApproved', 'Boolean', 'Filter berdasarkan status persetujuan'],
        ['uploaderId', 'String', 'Filter berdasarkan ID pengunggah'],
        ['dashboard', 'String ("true")', 'Mode dashboard: hanya menampilkan publikasi milik user yang login'],
      ]
    ),

    heading2('10.8 Static File Serving'),
    para('File PDF yang diunggah dapat diakses melalui endpoint statis:'),
    bulletRuns([{ text: 'URL Pattern: ', bold: true }, { text: 'http://localhost:8000/uploads/{nama-file}.pdf' }]),
    para('Direktori penyimpanan fisik pada server: backend/public/uploads/'),
  ];
  sections.push({ children: bab10 });

  // ═══════════════════ BAB 11: INSTALASI ═══════════════════
  const bab11 = [
    pageBreak(),
    heading1('BAB 11 – Instalasi dan Konfigurasi Sistem'),
    emptyPara(),
    heading2('11.1 Persyaratan Sistem'),
    para('Sebelum melakukan instalasi, pastikan sistem telah memenuhi persyaratan berikut:'),
    makeTable(
      ['Komponen', 'Persyaratan Minimum', 'Keterangan'],
      [
        ['Node.js', 'Versi 18 atau lebih baru', 'Runtime JavaScript'],
        ['npm', 'Versi 9 atau lebih baru', 'Package manager (terinstal bersama Node.js)'],
        ['MySQL', 'Versi 8.0 atau lebih baru', 'Sistem database relasional'],
        ['Git', 'Versi terbaru', 'Version control (opsional)'],
        ['Text Editor', 'VS Code (direkomendasikan)', 'Untuk mengedit kode sumber'],
      ]
    ),

    heading2('11.2 Konfigurasi Database'),
    numberedPara('Buat database baru pada MySQL:'),
    para('    CREATE DATABASE stiesnu_repo;'),
    numberedPara('Catat informasi koneksi database: host, port, username, password, dan nama database.'),

    heading2('11.3 Instalasi Backend'),
    numberedPara('Buka terminal dan arahkan ke direktori backend:'),
    para('    cd backend'),
    numberedPara('Instal dependensi:'),
    para('    npm install'),
    numberedPara('Salin file konfigurasi environment:'),
    para('    cp .env.example .env'),
    numberedPara('Edit file .env dan sesuaikan konfigurasi:'),
    para('    DATABASE_URL="mysql://username:password@localhost:3306/stiesnu_repo"'),
    para('    JWT_SECRET="secret-key-yang-sangat-rahasia"'),
    para('    NODE_ENV="development"'),
    para('    PORT=8000'),
    numberedPara('Sinkronisasi skema database:'),
    para('    npx prisma db push'),
    numberedPara('Generate Prisma Client:'),
    para('    npx prisma generate'),
    numberedPara('(Opsional) Jalankan seeder untuk data dummy:'),
    para('    npx prisma db seed'),
    numberedPara('Jalankan server backend:'),
    para('    npm run dev'),
    para('Server backend akan berjalan pada http://localhost:8000.'),

    heading2('11.4 Instalasi Frontend'),
    numberedPara('Buka terminal baru dan arahkan ke direktori frontend:'),
    para('    cd frontend'),
    numberedPara('Instal dependensi:'),
    para('    npm install'),
    numberedPara('Pastikan konfigurasi base URL API pada file src/api/axios.ts mengarah ke backend:'),
    para('    baseURL: "http://localhost:8000/api"'),
    numberedPara('Jalankan server development:'),
    para('    npm run dev'),
    para('Aplikasi frontend akan berjalan pada http://localhost:5173.'),

    heading2('11.5 Akses Prisma Studio (Opsional)'),
    para('Untuk melihat dan memanipulasi data database secara visual melalui browser:'),
    para('    npx prisma studio'),
    para('Prisma Studio akan terbuka di http://localhost:5555.'),

    heading2('11.6 Build untuk Produksi'),
    heading3('Frontend:'),
    para('    npm run build'),
    para('Hasil build berada di direktori frontend/dist/ yang dapat di-deploy ke web server statis.'),
    heading3('Backend:'),
    para('    npm run build'),
    para('    npm start'),
    para('Hasil build TypeScript berada di direktori backend/dist/.'),
  ];
  sections.push({ children: bab11 });

  // ═══════════════════ BAB 12: PANDUAN PENGGUNA UMUM ═══════════════════
  const bab12 = [
    pageBreak(),
    heading1('BAB 12 – Panduan Penggunaan untuk Pengguna Umum'),
    emptyPara(),
    heading2('12.1 Mengakses Website'),
    para('Buka browser dan akses alamat URL sistem repositori. Halaman beranda (landing page) akan ditampilkan dengan informasi umum tentang repositori dan navigasi ke halaman lainnya.'),

    heading2('12.2 Menelusuri Koleksi Karya Ilmiah'),
    numberedPara('Klik menu "Koleksi" atau "Repository" pada navigasi utama.'),
    numberedPara('Gunakan kolom pencarian untuk mencari karya ilmiah berdasarkan kata kunci yang terkait dengan judul, abstrak, atau nama penulis.'),
    numberedPara('Gunakan dropdown filter untuk menyaring berdasarkan "Tipe" karya ilmiah (Skripsi, Jurnal, dll.) atau "Program Studi".'),
    numberedPara('Klik pada judul karya ilmiah untuk melihat detail lengkap.'),
    numberedPara('Gunakan navigasi paginasi di bagian bawah halaman untuk berpindah antar halaman jika koleksi sangat banyak.'),

    heading2('12.3 Melihat Detail Karya Ilmiah'),
    para('Pada halaman detail karya ilmiah, informasi berikut akan ditampilkan:'),
    bullet('Judul karya ilmiah'),
    bullet('Nama penulis dan afiliasi'),
    bullet('Abstrak lengkap'),
    bullet('Tahun terbit'),
    bullet('Program studi'),
    bullet('Tipe karya ilmiah'),
    bullet('Kata kunci terkait'),
    bullet('Tombol untuk mengunduh atau melihat file PDF'),
    bullet('Tautan ke Google Scholar (jika tersedia)'),

    heading2('12.4 Mendaftar Akun Baru'),
    numberedPara('Klik menu "Daftar" atau "Register" pada navigasi.'),
    numberedPara('Isi formulir pendaftaran: nama lengkap, alamat email, dan kata sandi.'),
    numberedPara('Klik tombol "Daftar".'),
    numberedPara('Sistem akan menampilkan pesan bahwa pendaftaran berhasil dan akun sedang menunggu persetujuan administrator.'),
    numberedPara('Tunggu hingga administrator mengaktifkan akun Anda sebelum dapat login.'),

    heading2('12.5 Login ke Sistem'),
    numberedPara('Klik menu "Masuk" atau "Login".'),
    numberedPara('Masukkan alamat email dan kata sandi yang telah terdaftar.'),
    numberedPara('Klik tombol "Masuk".'),
    numberedPara('Jika berhasil, Anda akan diarahkan ke halaman Dashboard.'),
    numberedPara('Jika akun belum disetujui, sistem akan menampilkan pesan bahwa akun sedang diverifikasi.'),

    heading2('12.6 Mengunggah Karya Ilmiah'),
    numberedPara('Setelah login, akses menu "Unggah" atau "Upload" pada sidebar dashboard.'),
    numberedPara('Isi formulir unggah dengan lengkap:'),
    bullet('Judul karya ilmiah', 1),
    bullet('Abstrak', 1),
    bullet('Nama penulis dan afiliasi (opsional)', 1),
    bullet('Tahun terbit', 1),
    bullet('Program studi', 1),
    bullet('Tipe karya ilmiah', 1),
    bullet('Kata kunci (dipisahkan koma atau JSON array)', 1),
    bullet('URL Google Scholar (opsional)', 1),
    bullet('File PDF', 1),
    numberedPara('Klik tombol "Simpan" atau "Submit".'),
    numberedPara('Karya ilmiah akan berstatus "Menunggu Persetujuan" hingga divalidasi oleh administrator.'),
  ];
  sections.push({ children: bab12 });

  // ═══════════════════ BAB 13: PANDUAN ADMIN ═══════════════════
  const bab13 = [
    pageBreak(),
    heading1('BAB 13 – Panduan Penggunaan untuk Administrator'),
    emptyPara(),
    heading2('13.1 Login sebagai Administrator'),
    para('Gunakan akun dengan peran ADMIN untuk login ke sistem. Akun administrator default (dari seeder): email: admin@stiesnu.ac.id, password: password123.'),

    heading2('13.2 Dashboard Admin'),
    para('Setelah login, halaman Dashboard Overview menampilkan:'),
    bullet('Statistik umum: total publikasi (approved), total penulis, total pengguna terverifikasi dan belum terverifikasi.'),
    bullet('Jumlah publikasi yang menunggu persetujuan.'),
    bullet('Grafik distribusi publikasi berdasarkan tipe (pie/donut chart).'),
    bullet('Grafik tren publikasi berdasarkan tahun (line/bar chart).'),
    bullet('Distribusi pengguna berdasarkan peran.'),

    heading2('13.3 Manajemen Pengguna'),
    numberedPara('Akses menu "Pengguna" atau "Users" pada sidebar dashboard.'),
    numberedPara('Halaman akan menampilkan daftar seluruh pengguna terdaftar dalam format tabel atau kartu.'),
    numberedPara('Untuk menyetujui pengguna baru: klik tombol "Approve" atau "Setujui" pada baris pengguna yang bersangkutan.'),
    numberedPara('Untuk mengubah peran pengguna: klik tombol Edit dan pilih peran baru dari dropdown (GUEST, MAHASISWA, DOSEN, ADMIN).'),
    numberedPara('Untuk menghapus pengguna: klik tombol "Hapus" dan konfirmasi penghapusan.'),
    numberedPara('Untuk membuat pengguna baru secara manual: klik tombol "Tambah Pengguna" dan isi formulir.'),

    heading2('13.4 Manajemen Karya Ilmiah'),
    numberedPara('Akses menu "Karya Ilmiah" atau "Publications" pada sidebar dashboard.'),
    numberedPara('Sebagai admin, Anda dapat melihat seluruh karya ilmiah termasuk yang belum disetujui.'),
    numberedPara('Untuk menyetujui karya ilmiah: klik tombol "Approve" atau gunakan toggle persetujuan pada baris publikasi.'),
    numberedPara('Untuk mengedit metadata karya ilmiah: klik tombol "Edit", lakukan perubahan pada formulir, dan simpan.'),
    numberedPara('Untuk menghapus karya ilmiah yang tidak sesuai: klik tombol "Hapus" dan konfirmasi.'),

    heading2('13.5 Mengunggah Karya Ilmiah sebagai Admin'),
    para('Administrator juga dapat mengunggah karya ilmiah. Perbedaan dengan pengguna biasa: karya ilmiah yang diunggah oleh admin secara otomatis memiliki status "Disetujui" (auto-approved) sehingga langsung muncul di halaman publik.'),
  ];
  sections.push({ children: bab13 });

  // ═══════════════════ BAB 14: KEAMANAN ═══════════════════
  const bab14 = [
    pageBreak(),
    heading1('BAB 14 – Keamanan Sistem'),
    emptyPara(),
    heading2('14.1 Autentikasi'),
    para('Sistem mengimplementasikan autentikasi berbasis JSON Web Token (JWT) dengan mekanisme berikut:', { indent: true }),
    bullet('Token JWT berisi payload: user ID, email, peran, dan nama pengguna.'),
    bullet('Token memiliki masa berlaku 7 hari.'),
    bullet('Token disimpan sebagai HTTP-Only cookie yang tidak dapat diakses melalui JavaScript di sisi klien, sehingga mengurangi risiko serangan XSS (Cross-Site Scripting).'),
    bullet('Pengaturan sameSite cookie disesuaikan berdasarkan environment (lax untuk development, none untuk production).'),
    bullet('Pengaturan secure flag diaktifkan dalam environment production.'),

    heading2('14.2 Hashing Kata Sandi'),
    para('Seluruh kata sandi pengguna di-hash menggunakan pustaka bcrypt.js dengan cost factor 10 sebelum disimpan ke database. Proses perbandingan kata sandi saat login menggunakan fungsi bcrypt.compare() yang aman terhadap timing attack.', { indent: true }),

    heading2('14.3 Otorisasi Berbasis Peran (RBAC)'),
    para('Sistem menerapkan Role-Based Access Control (RBAC) melalui beberapa lapisan middleware:'),
    bulletRuns([{ text: 'authMiddleware: ', bold: true }, { text: 'Memvalidasi keberadaan dan keabsahan token JWT. Menolak akses jika token tidak ada atau tidak valid.' }]),
    bulletRuns([{ text: 'adminMiddleware: ', bold: true }, { text: 'Memastikan pengguna memiliki peran ADMIN. Digunakan untuk endpoint yang hanya dapat diakses oleh administrator.' }]),
    bulletRuns([{ text: 'nonGuestMiddleware: ', bold: true }, { text: 'Memastikan pengguna bukan GUEST. Digunakan untuk endpoint seperti unggah karya ilmiah.' }]),
    bulletRuns([{ text: 'optionalAuthMiddleware: ', bold: true }, { text: 'Memvalidasi token jika ada, tetapi tidak menolak akses jika tidak ada. Digunakan pada endpoint publik yang perlu mengetahui identitas pengguna (jika login).' }]),

    heading2('14.4 Validasi Input dan File'),
    bullet('Validasi sisi server pada seluruh endpoint untuk memastikan kelengkapan field yang diperlukan.'),
    bullet('Validasi tipe file pada unggahan: hanya file dengan MIME type application/pdf yang diterima.'),
    bullet('Pembatasan ukuran file unggahan maksimal 50 MB.'),
    bullet('Penamaan file unggahan menggunakan timestamp dan angka acak untuk mencegah konflik nama dan serangan traversal path.'),

    heading2('14.5 CORS (Cross-Origin Resource Sharing)'),
    para('Konfigurasi CORS membatasi akses API hanya dari origin yang diizinkan (http://localhost:5173 pada development). Kredensial (cookies) diizinkan dikirim antar origin melalui pengaturan credentials: true.'),

    heading2('14.6 Perlindungan Data'),
    bullet('Password tidak pernah dikirimkan kembali dalam response API.'),
    bullet('Endpoint GET users hanya mengembalikan field yang diperlukan (select clause), tidak termasuk password.'),
    bullet('Pengguna non-admin hanya dapat melihat karya ilmiah yang telah disetujui (approved), kecuali milik mereka sendiri.'),
    bullet('Pengguna hanya dapat mengedit atau menghapus karya ilmiah milik sendiri (kecuali admin).'),
  ];
  sections.push({ children: bab14 });

  // ═══════════════════ BAB 15: KELEBIHAN & KETERBATASAN ═══════════════════
  const bab15 = [
    pageBreak(),
    heading1('BAB 15 – Kelebihan dan Keterbatasan Sistem'),
    emptyPara(),
    heading2('15.1 Kelebihan Sistem'),
    numberedParaRuns([{ text: 'Arsitektur Modern dan Terpisah: ', bold: true }, { text: 'Arsitektur Client-Server dengan pemisahan frontend dan backend memungkinkan pengembangan dan pemeliharaan yang independen serta skalabilitas yang lebih baik.' }]),
    numberedParaRuns([{ text: 'Antarmuka Pengguna Responsif: ', bold: true }, { text: 'Dibangun menggunakan Vue.js 3 dan Tailwind CSS dengan dukungan dark mode, menghasilkan antarmuka yang modern, responsif, dan nyaman digunakan di berbagai ukuran perangkat.' }]),
    numberedParaRuns([{ text: 'Sistem Persetujuan Bertingkat: ', bold: true }, { text: 'Mekanisme approval workflow baik untuk pengguna baru maupun karya ilmiah memastikan kualitas data dan konten yang dipublikasikan.' }]),
    numberedParaRuns([{ text: 'Keamanan Berlapis: ', bold: true }, { text: 'Implementasi JWT dengan HTTP-Only cookie, bcrypt hashing, RBAC middleware, dan validasi input memberikan perlindungan yang komprehensif.' }]),
    numberedParaRuns([{ text: 'Pencarian dan Filter Komprehensif: ', bold: true }, { text: 'Fitur pencarian multi-field dan filter berdasarkan tipe, program studi, dan penulis memudahkan pengguna menemukan karya ilmiah yang dibutuhkan.' }]),
    numberedParaRuns([{ text: 'Dashboard Analitik: ', bold: true }, { text: 'Visualisasi data melalui grafik interaktif memberikan insight tentang produktivitas karya ilmiah institusi.' }]),
    numberedParaRuns([{ text: 'Type Safety: ', bold: true }, { text: 'Penggunaan TypeScript pada frontend dan backend mengurangi risiko bug dan meningkatkan maintainability kode.' }]),
    numberedParaRuns([{ text: 'Database ORM: ', bold: true }, { text: 'Prisma ORM menyederhanakan operasi database dan menyediakan type-safe query serta manajemen skema yang efisien.' }]),
    numberedParaRuns([{ text: 'Komponen UI Reusable: ', bold: true }, { text: 'Pustaka komponen UI kustom (Button, Card, Input, dll.) memastikan konsistensi desain dan mempercepat pengembangan fitur baru.' }]),

    heading2('15.2 Keterbatasan Sistem'),
    numberedParaRuns([{ text: 'Tidak Ada Full-Text Search: ', bold: true }, { text: 'Pencarian saat ini hanya berdasarkan metadata (judul, abstrak, nama penulis), belum mendukung pencarian teks lengkap di dalam isi dokumen PDF.' }]),
    numberedParaRuns([{ text: 'Penyimpanan File Lokal: ', bold: true }, { text: 'File PDF disimpan di sistem file lokal server, bukan cloud storage. Hal ini membatasi skalabilitas dan redundansi data.' }]),
    numberedParaRuns([{ text: 'Belum Terintegrasi Repositori Nasional: ', bold: true }, { text: 'Sistem belum terhubung dengan repositori nasional seperti GARUDA, SINTA, atau OAI-PMH harvester.' }]),
    numberedParaRuns([{ text: 'Single Language: ', bold: true }, { text: 'Antarmuka saat ini hanya tersedia dalam Bahasa Indonesia, belum mendukung multi-bahasa (internasionalisasi).' }]),
    numberedParaRuns([{ text: 'Tidak Ada Notifikasi: ', bold: true }, { text: 'Sistem belum memiliki mekanisme notifikasi (email atau push notification) untuk memberi tahu pengguna tentang status persetujuan akun atau karya ilmiah.' }]),
    numberedParaRuns([{ text: 'Tidak Ada Rate Limiting: ', bold: true }, { text: 'API belum dilengkapi dengan rate limiting untuk mencegah penyalahgunaan (abuse) atau serangan brute force.' }]),
    numberedParaRuns([{ text: 'Backup Otomatis: ', bold: true }, { text: 'Sistem belum menyediakan mekanisme backup database dan file secara otomatis.' }]),
    numberedParaRuns([{ text: 'Format File Terbatas: ', bold: true }, { text: 'Hanya mendukung format PDF untuk unggahan karya ilmiah.' }]),
  ];
  sections.push({ children: bab15 });

  // ═══════════════════ BAB 16: RENCANA PENGEMBANGAN ═══════════════════
  const bab16 = [
    pageBreak(),
    heading1('BAB 16 – Rencana Pengembangan ke Depan'),
    emptyPara(),
    para('Berdasarkan evaluasi fitur dan keterbatasan yang telah diidentifikasi, berikut adalah rencana pengembangan sistem ke depan yang diurutkan berdasarkan prioritas:', { indent: true }),

    heading2('16.1 Prioritas Tinggi'),
    numberedParaRuns([{ text: 'Integrasi Notifikasi Email: ', bold: true }, { text: 'Mengimplementasikan sistem notifikasi email menggunakan pustaka seperti Nodemailer untuk memberi tahu pengguna saat akun disetujui, karya ilmiah di-approve, atau terdapat perubahan penting lainnya.' }]),
    numberedParaRuns([{ text: 'Full-Text Search: ', bold: true }, { text: 'Mengintegrasikan layanan pencarian teks lengkap seperti Elasticsearch atau MeiliSearch untuk memungkinkan pencarian di dalam isi dokumen PDF.' }]),
    numberedParaRuns([{ text: 'Cloud Storage: ', bold: true }, { text: 'Memigrasikan penyimpanan file PDF dari sistem file lokal ke layanan cloud storage seperti Amazon S3, Google Cloud Storage, atau MinIO untuk meningkatkan skalabilitas dan reliabilitas.' }]),
    numberedParaRuns([{ text: 'Rate Limiting & Security Hardening: ', bold: true }, { text: 'Menambahkan rate limiting pada API, implementasi CSRF protection, dan audit keamanan menyeluruh.' }]),

    heading2('16.2 Prioritas Menengah'),
    numberedParaRuns([{ text: 'Integrasi Repositori Nasional: ', bold: true }, { text: 'Menyediakan API yang kompatibel dengan protokol OAI-PMH sehingga karya ilmiah dapat di-harvest oleh GARUDA dan terindeks di SINTA.' }]),
    numberedParaRuns([{ text: 'Sistem Backup Otomatis: ', bold: true }, { text: 'Implementasi scheduled backup untuk database dan file menggunakan cron job atau task scheduler.' }]),
    numberedParaRuns([{ text: 'Multi-Bahasa (i18n): ', bold: true }, { text: 'Menambahkan dukungan internasionalisasi dengan vue-i18n untuk menyediakan antarmuka dalam Bahasa Indonesia dan Bahasa Inggris.' }]),
    numberedParaRuns([{ text: 'DOI Integration: ', bold: true }, { text: 'Menyediakan fitur pendaftaran Digital Object Identifier (DOI) untuk setiap karya ilmiah yang dipublikasikan.' }]),
    numberedParaRuns([{ text: 'Sistem Komentar dan Review: ', bold: true }, { text: 'Menambahkan fitur peer-review atau komentar pada karya ilmiah untuk mendukung diskusi akademik.' }]),

    heading2('16.3 Prioritas Rendah'),
    numberedParaRuns([{ text: 'Analitik Lanjutan: ', bold: true }, { text: 'Menambahkan fitur analitik seperti jumlah unduhan, jumlah tampilan, dan sitasi per karya ilmiah.' }]),
    numberedParaRuns([{ text: 'Progressive Web App (PWA): ', bold: true }, { text: 'Mengonversi aplikasi frontend menjadi PWA agar dapat diakses secara offline dan diinstal di perangkat mobile.' }]),
    numberedParaRuns([{ text: 'Export Citation: ', bold: true }, { text: 'Menyediakan fitur eksport sitasi dalam format BibTeX, APA, IEEE, dan format sitasi lainnya.' }]),
    numberedParaRuns([{ text: 'Dukungan Format Tambahan: ', bold: true }, { text: 'Menambahkan dukungan format file selain PDF seperti DOCX, EPUB, dan format multimedia (video presentasi).' }]),
    numberedParaRuns([{ text: 'OAuth / SSO: ', bold: true }, { text: 'Mengintegrasikan autentikasi dengan penyedia identitas pihak ketiga seperti Google OAuth atau sistem SSO institusi.' }]),

    emptyPara(), emptyPara(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600 },
      children: [new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', font: FONT, size: 24, color: COLOR_ACCENT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'Akhir Dokumen', font: FONT, size: 24, italics: true, color: '999999' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Dokumentasi Repositori STIESNU Bengkulu — Versi 1.0 — April 2026', font: FONT, size: 20, color: '999999' })],
    }),
  ];
  sections.push({ children: bab16 });

  // ═══════════════════ BUILD DOCUMENT ═══════════════════
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'numbered-list',
          levels: [
            { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
            { level: 1, format: 'lowerLetter', text: '%2.', alignment: AlignmentType.START, style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 24 },
        },
      },
    },
    sections,
  });

  return doc;
}

// ── Generate and Save ──────────────────────────────────────────────────────
async function main() {
  console.log('Generating documentation...');
  const doc = buildDocument();
  const buffer = await Packer.toBuffer(doc);
  const outputPath = 'Dokumentasi_Repositori_STIESNU_Bengkulu.docx';
  fs.writeFileSync(outputPath, buffer);
  console.log(`Documentation generated successfully: ${outputPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
