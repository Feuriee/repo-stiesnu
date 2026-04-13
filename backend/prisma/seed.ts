import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding massive data...');

  // Hash password for all dummy accounts (password: "password123")
  const password = await bcrypt.hash('password123', 10);

  // 1. Create or Find Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stiesnu.ac.id' },
    update: { password },
    create: {
      name: 'Administrator',
      email: 'admin@stiesnu.ac.id',
      password,
      role: 'ADMIN',
      isApproved: true,
    },
  });

  const dosen = await prisma.user.upsert({
    where: { email: 'dosen@stiesnu.ac.id' },
    update: { password },
    create: {
      name: 'Bapak Ahmad Dosen',
      email: 'dosen@stiesnu.ac.id',
      password,
      role: 'DOSEN',
      isApproved: true,
    },
  });

  const mahasiswa = await prisma.user.upsert({
    where: { email: 'mahasiswa@stiesnu.ac.id' },
    update: { password },
    create: {
      name: 'Mahasiswa Berprestasi',
      email: 'mahasiswa@stiesnu.ac.id',
      password,
      role: 'MAHASISWA',
      isApproved: true,
    },
  });

  const mahasiswa2 = await prisma.user.upsert({
    where: { email: 'mahasiswa2@stiesnu.ac.id' },
    update: { password },
    create: {
      name: 'Mahasiswa Baru',
      email: 'mahasiswa2@stiesnu.ac.id',
      password,
      role: 'MAHASISWA',
      isApproved: true,
    },
  });

  console.log('Users ensured.');

  // 2. Create Additional Authors
  const authorsData = [
    { name: 'Dr. Ahmad Dosen, M.E.', affiliation: 'STIESNU Bengkulu' },
    { name: 'Mahasiswa Berprestasi', affiliation: 'STIESNU Bengkulu' },
    { name: 'Dr. Siti Nurhaliza, M.Si', affiliation: 'Universitas Indonesia' },
    { name: 'Prof. Budi Santoso', affiliation: 'Universitas Gadjah Mada' },
    { name: 'Mahasiswa Baru', affiliation: 'STIESNU Bengkulu' },
  ];

  const createdAuthors = [];
  for (const a of authorsData) {
    const author = await prisma.author.create({ data: a });
    createdAuthors.push(author);
  }
  const [authorDosen, authorMhs, authorSiti, authorBudi, authorMhs2] = createdAuthors as Array<any>;
  console.log('Authors created.');

  // 3. Create Dummy Publications
  const publicationsData = [
    {
      title: 'Dampak Kebijakan Moneter Islam Terhadap Inflasi di Indonesia',
      abstract: 'Penelitian ini membahas bagaimana kebijakan moneter berbasis syariah dapat menekan laju inflasi secara berkelanjutan. Hasil penelitian menunjukkan instrumen seperti Sukuk Negara sangat efektif dalam menjangkau masyarakat...',
      year: 2023,
      programStudy: 'Ekonomi Syariah',
      type: 'Jurnal',
      isApproved: true,
      authorId: authorDosen.id,
      uploaderId: dosen.id,
    },
    {
      title: 'Strategi Pemasaran Digital pada UMKM Halal di Kota Bengkulu',
      abstract: 'Skripsi ini mengkaji penerapan pemasaran digital pada UMKM berbasis produk halal di wilayah Bengkulu. Adopsi platform media sosial secara signifikan meningkatkan omset penjualan sebesar 20% pada tahun pertama...',
      year: 2024,
      programStudy: 'Manajemen Bisnis Syariah',
      type: 'Skripsi',
      isApproved: true,
      authorId: authorMhs.id,
      uploaderId: mahasiswa.id,
    },
    {
      title: 'Peran Zakat Produktif Dalam Pengentasan Kemiskinan',
      abstract: 'Penelitian kualitatif ini mengkaji fungsi dari zakat produktif di Baznas. Hasilnya, zakat tidak hanya memenuhi kebutuhan jangka pendek, melainkan menopang modal kewirausahaan kecil.',
      year: 2022,
      programStudy: 'Ekonomi Syariah',
      type: 'Artikel Ilmiah',
      isApproved: true,
      authorId: authorSiti.id,
      uploaderId: dosen.id,
    },
    {
      title: 'Analisis Akuntansi Syariah Pada Pembiayaan Murabahah',
      abstract: 'Buku ajar ini memberikan wawasan fundamental tentang PSAK 102 yang membahas standar pelaporan aset perbankan yang menggunakan skema Margin/Murabahah.',
      year: 2021,
      programStudy: 'Perbankan Syariah',
      type: 'Buku Ajar',
      isApproved: true,
      authorId: authorBudi.id,
      uploaderId: admin.id,
    },
    {
      title: 'Pengaruh Gaya Kepemimpinan Islami Terhadap Kinerja Karyawan',
      abstract: 'Dalam laporan penelitian ini akan diuraikan bagaimana gaya kepemimpinan profetik (Siddiq, Amanah, Tabligh, Fathonah) sangat penting terhadap motivasi pegawai Bank Syariah lokal.',
      year: 2023,
      programStudy: 'Manajemen Bisnis Syariah',
      type: 'Laporan Penelitian',
      isApproved: true,
      authorId: authorMhs2.id,
      uploaderId: mahasiswa2.id,
    },
    {
      title: 'Optimalisasi Fintech Syariah P2P Lending untuk Petani',
      abstract: 'Sebuah prosiding kolaboratif yang menjelaskan kemudahan Peer-To-Peer Lending Syariah yang tak membebani petani bawang dengan bunga rentenir.',
      year: 2024,
      programStudy: 'Perbankan Syariah',
      type: 'Prosiding',
      isApproved: true,
      authorId: authorDosen.id,
      uploaderId: dosen.id,
    },
    {
      title: 'Pola Perilaku Konsumen Generasi Z Pada E-Commerce Berlabel Syariah',
      abstract: 'Skripsi komprehensif menguji gaya konsumtif dan prefensi mahasiswa terhadap Shopee Barokah atau Tokopedia Halal Center.',
      year: 2023,
      programStudy: 'Manajemen Bisnis Syariah',
      type: 'Skripsi',
      isApproved: false, // Menunggu ACC Admin
      authorId: authorMhs.id,
      uploaderId: mahasiswa.id,
    },
  ];

  for (const pub of publicationsData) {
    await prisma.publication.create({ data: pub });
  }

  console.log(`Created ${publicationsData.length} Publications.`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
