import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Hash password for all dummy accounts (password: "password123")
  const password = await bcrypt.hash(' ', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stiesnu.ac.id' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@stiesnu.ac.id',
      password,
      role: 'ADMIN',
      isApproved: true,
    },
  });

  // 2. Create Dose
  const dosen = await prisma.user.upsert({
    where: { email: 'dosen@stiesnu.ac.id' },
    update: {},
    create: {
      name: 'Bapak Dosen',
      email: 'dosen@stiesnu.ac.id',
      password,
      role: 'DOSEN',
      isApproved: true,
    },
  });

  // 3. Create Mahasiswa
  const mahasiswa = await prisma.user.upsert({
    where: { email: 'mahasiswa@stiesnu.ac.id' },
    update: {},
    create: {
      name: 'Mahasiswa Berprestasi',
      email: 'mahasiswa@stiesnu.ac.id',
      password,
      role: 'MAHASISWA',
      isApproved: true,
    },
  });

  console.log('Created Users:', admin.email, dosen.email, mahasiswa.email);

  // 4. Create Authors (For publications)
  const authorDosen = await prisma.author.create({
    data: {
      name: 'Bapak Dosen',
      affiliation: 'STIESNU Bengkulu',
    },
  });

  const authorMahasiswa = await prisma.author.create({
    data: {
      name: 'Mahasiswa Berprestasi',
      affiliation: 'STIESNU Bengkulu',
    },
  });

  // 5. Create Dummy Publications
  const pub1 = await prisma.publication.create({
    data: {
      title: 'Dampak Kebijakan Moneter Islam Terhadap Inflasi di Indonesia',
      abstract: 'Penelitian ini membahas bagaimana kebijakan moneter berbasis syariah dapat menekan laju inflasi secara berkelanjutan. Hasil penelitian menunjukkan instrumen seperti Sukuk Negara sangat efektif...',
      year: 2023,
      programStudy: 'Ekonomi Syariah',
      type: 'Jurnal',
      isApproved: true,
      authorId: authorDosen.id,
      uploaderId: dosen.id,
    },
  });

  const pub2 = await prisma.publication.create({
    data: {
      title: 'Strategi Pemasaran Digital pada UMKM Halal di Kota Bengkulu',
      abstract: 'Skripsi ini mengkaji penerapan pemasaran digital pada UMKM berbasis produk halal di wilayah Bengkulu. Adopsi platform media sosial secara signifikan meningkatkan omset penjualan...',
      year: 2024,
      programStudy: 'Manajemen Bisnis Syariah',
      type: 'Skripsi',
      isApproved: true,
      authorId: authorMahasiswa.id,
      uploaderId: mahasiswa.id,
    },
  });

  console.log('Created Publications:', pub1.title, pub2.title);

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
