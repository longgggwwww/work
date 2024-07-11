import { $Enums, PrismaClient } from '@prisma/client';
import { Permission } from '../src/permission/permission.enum';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.role.upsert({
    where: {
      slug: 'admin',
    },
    update: {},
    create: {
      name: 'Admin',
      slug: 'admin',
      permissions: [
        Permission.CreateAndModifyUser,
        Permission.CreateAndModifyRole,
        Permission.ApproveCompanyRegistrationRequest,
      ],
    },
  });
  const user = await prisma.role.upsert({
    where: {
      slug: 'user',
    },
    update: {},
    create: {
      name: 'User',
      slug: 'user',
      permissions: [],
    },
  });

  const setting = await prisma.setting.upsert({
    where: { id: 1 },
    update: {
      roleId: user.id,
    },
    create: {
      roleId: user.id,
      gender: $Enums.Gender.OTHER,
    },
  });
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
