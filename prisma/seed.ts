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

  const code = '123456';
  const hashedCode = await generateHash(code);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'testadmin@exemple.com',
      password: hashedPassword,
      role: 'ADMIN',
      is_verified_account: true,
    },
  });

  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 1);
  await prisma.user.create({
    data: {
      name: 'Code Expired',
      email: 'codeexpired@exemple.com',
      password: hashedPassword,
      role: 'USER',
      is_verified_account: true,
      verification_code: {
        create: {
          code: hashedCode,
          expires_at: expiredDate,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: 'Not Verify',
      email: 'notverify@exemple.com',
      password: hashedPassword,
      role: 'USER',
      is_verified_account: false,
    },
  });
}

main();
