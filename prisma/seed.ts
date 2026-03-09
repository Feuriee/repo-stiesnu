import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter, log: ['info', 'warn', 'error'] })

async function main() {
  console.log('🔄  Membersihkan data lama...')
  await prisma.publicationKeyword.deleteMany()
  await prisma.publication.deleteMany()
  await prisma.keyword.deleteMany()
  await prisma.author.deleteMany()
  await prisma.user.deleteMany()

  console.log('🌱  Memulai seeding database...')
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // 1. Create Users
  console.log('👤  Membuat users (Admin, Dosen)...')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stiesnu.ac.id' },
    update: {},
    create: {
      email: 'admin@stiesnu.ac.id',
      name: 'Administrator',
      password: hashedPassword,
      role: Role.ADMIN,
      isApproved: true,
    },
  })

  const dosen1 = await prisma.user.upsert({
    where: { email: 'dosen1@stiesnu.ac.id' },
    update: {},
    create: {
      email: 'dosen1@stiesnu.ac.id',
      name: 'Dr. Ahmad Fauzi',
      password: hashedPassword,
      role: Role.DOSEN,
      isApproved: true,
    },
  })

  const dosen2 = await prisma.user.upsert({
    where: { email: 'dosen2@stiesnu.ac.id' },
    update: {},
    create: {
      email: 'dosen2@stiesnu.ac.id',
      name: 'Siti Aminah, M.E.',
      password: hashedPassword,
      role: Role.DOSEN,
      isApproved: true,
    },
  })

  // 2. Create Authors
  console.log('✍️   Membuat authors...')
  const authorsData = [
    { name: 'Ahmad Abdullah', affiliation: 'STIESNU Bengkulu' },
    { name: 'Dr. Ahmad Fauzi', affiliation: 'STIESNU Bengkulu' },
    { name: 'Siti Aminah, M.E.', affiliation: 'STIESNU Bengkulu' },
    { name: 'Budi Santoso', affiliation: 'Universitas Islam Madinah' },
    { name: 'Linda Rahmawati', affiliation: 'STIESNU Bengkulu' }
  ];

  const authors = await Promise.all(
    authorsData.map(data => prisma.author.create({ data }))
  )

  // 3. Create Keywords
  console.log('🔑  Membuat keywords...')
  const keywordsData = [
    'Ekonomi Syariah', 'Perbankan', 'Zakat', 'Wakaf', 'Manajemen', 
    'Keuangan', 'Fintech', 'UMKM', 'Hukum Islam', 'Makroekonomi'
  ];

  const keywords = await Promise.all(
    keywordsData.map(name => prisma.keyword.create({ data: { name } }))
  )

  // 4. Create Publications
  console.log('📚  Membuat publications...')
  const publicationsData = [
    {
      title: 'Dampak Digitalisasi Terhadap Pertumbuhan Perbankan Syariah di Bengkulu',
      abstract: 'Penelitian ini bertujuan untuk menganalisis sejauh mana digitalisasi mempengaruhi pertumbuhan aset dan jumlah nasabah pada perbankan syariah di kota Bengkulu. Metode kuantitatif dengan regresi data panel menunjukkan hasil yang positif dan signifikan terhadap pertumbuhan.',
      year: 2023,
      programStudy: 'Perbankan Syariah',
      type: 'Jurnal',
      authorIndex: 1, // Dr. Ahmad Fauzi
      uploaderId: dosen1.id,
      keywordIndexes: [0, 1, 6] // Ekonomi Syariah, Perbankan, Fintech
    },
    {
      title: 'Optimalisasi Pengelolaan Dana Zakat Produktif untuk Pemberdayaan UMKM',
      abstract: 'Skripsi ini membahas strategi BAZNAS dalam menyalurkan dana zakat produktif bagi pelaku UMKM di Provinsi Bengkulu. Hasil menunjukkan bahwa modal kerja dari dana zakat efektif meningkatkan pendapatan mustahik.',
      year: 2024,
      programStudy: 'Ekonomi Syariah',
      type: 'Skripsi',
      authorIndex: 0, // Ahmad Abdullah
      uploaderId: admin.id,
      keywordIndexes: [2, 7, 0] // Zakat, UMKM, Ekonomi Syariah
    },
    {
      title: 'Manajemen Risiko Pembiayaan Mudharabah pada BPRS Harta Insan Karimah',
      abstract: 'Penelitian ini mengkaji penerapan manajemen risiko pembiayaan berbasis bagi hasil (mudharabah). Ditemukan bahwa mitigasi risiko masih perlu ditingkatkan pada tahapan screening nasabah.',
      year: 2022,
      programStudy: 'Perbankan Syariah',
      type: 'Laporan Penelitian',
      authorIndex: 2, // Siti Aminah
      uploaderId: dosen2.id,
      keywordIndexes: [1, 4, 5] // Perbankan, Manajemen, Keuangan
    },
    {
      title: 'Tinjauan Hukum Ekonomi Syariah Terhadap Praktik Dropshipping di E-Commerce',
      abstract: 'Maraknya praktik jual beli dropshipping menimbulkan pertanyaan dari segi hukum Islam, khususnya rukun jual beli dan kepemilikan barang (qabdh). Terdapat pandangan ulama kontemporer yang membolehkan dengan syarat-syarat tertentu.',
      year: 2023,
      programStudy: 'Hukum Ekonomi Syariah',
      type: 'Prosiding',
      authorIndex: 3, // Budi Santoso
      uploaderId: admin.id,
      keywordIndexes: [8, 0] // Hukum Islam, Ekonomi Syariah
    },
    {
      title: 'Buku Ajar: Pengantar Makroekonomi Islam',
      abstract: 'Buku ajar ini memberikan pemahaman komprehensif mengenai konsep dasar makroekonomi dari perspektif Islam, termasuk kebijakan moneter, fiskal, dan keseimbangan instrumen ekonomi secara Islami.',
      year: 2024,
      programStudy: 'Ekonomi Syariah',
      type: 'Buku Ajar dosen',
      authorIndex: 1, // Dr. Ahmad Fauzi
      uploaderId: dosen1.id,
      keywordIndexes: [9, 0, 4] // Makroekonomi, Ekonomi Syariah, Manajemen
    },
    {
      title: 'Pengaruh Kebijakan Fiskal Terhadap Distribusi Kekayaan Dalam Islam',
      abstract: 'Tesis ini membahas efektivitas instrumen kebijakan fiskal Islam (zakat, pajak, wakaf) dalam meredistribusi kekayaan agar tidak berputar pada golongan kaya saja.',
      year: 2021,
      programStudy: 'Ekonomi Syariah',
      type: 'Tesis',
      authorIndex: 4, // Linda Rahmawati
      uploaderId: admin.id,
      keywordIndexes: [0, 2, 3] // Ekonomi Syariah, Zakat, Wakaf
    }
  ];

  for (const pub of publicationsData) {
    const publication = await prisma.publication.create({
      data: {
        title: pub.title,
        abstract: pub.abstract,
        year: pub.year,
        programStudy: pub.programStudy,
        type: pub.type,
        authorId: authors[pub.authorIndex].id,
        uploaderId: pub.uploaderId,
      }
    });

    // Link keywords
    for (const kwIndex of pub.keywordIndexes) {
      await prisma.publicationKeyword.create({
        data: {
          publicationId: publication.id,
          keywordId: keywords[kwIndex].id
        }
      });
    }
  }

  console.log('✅  Seeding selesai dengan sukses!')
  console.log('\n--- Kredensial Uji ---')
  console.log('Admin:', 'admin@stiesnu.ac.id', '/ password123')
  console.log('Dosen:', 'dosen1@stiesnu.ac.id', '/ password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
