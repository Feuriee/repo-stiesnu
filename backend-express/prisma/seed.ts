import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@stiesnu.ac.id';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await prisma.user.create({
      data: {
        name: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isApproved: true,
      },
    });
    console.log('✅ Admin user account securely seeded. Email: admin@stiesnu.ac.id | Password: admin');
  } else {
    console.log('✅ Admin user account already exists in MySQL.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
