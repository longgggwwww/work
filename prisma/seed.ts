import { $Enums, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'root',
      slug: 'admin',
      permissions: [],
    },
  });
  const setting = await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      roleId: admin.id,
      gender: $Enums.Gender.OTHER,
    },
  });
  const root = await prisma.user.upsert({
    where: { email: 'admin@iit.vn' },
    update: {},
    create: {
      email: 'admin@iit.vn',
      roles: {
        connect: [{ id: admin.id }],
      },
    },
  });
  console.log(root);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
