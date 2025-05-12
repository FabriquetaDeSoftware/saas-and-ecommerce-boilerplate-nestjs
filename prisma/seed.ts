import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function generateHash(data: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);

  const hashedData = await bcrypt.hash(data, salt);

  return hashedData;
}

async function main() {
  const password = 'Password123!';
  const hashedPassword = await generateHash(password);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'testadmin@exemple.com',
      password: hashedPassword,
      role: 'ADMIN',
      is_verified_account: true,
    },
  });
}

main();
