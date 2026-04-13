import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function check() {
  const admin = await prisma.user.findUnique({ where: { email: 'admin@stiesnu.ac.id' } });
  if (admin) {
    console.log("Admin password hash:", admin.password.substring(0, 20) + "...");
    const isValid = await bcrypt.compare('password123', admin.password);
    console.log("Is 'password123' valid for admin? ", isValid);
  } else {
    console.log("Admin not found!");
  }
}

check().finally(() => prisma.$disconnect());
