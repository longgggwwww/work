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
      permissions: Object.values(Permission),
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
  const root = await prisma.user.upsert({
    where: {
      email: 'info@iit.vn',
    },
    update: {
      email: 'info@iit.vn',
      profile: {
        upsert: {
          where: {
            user: {
              email: 'info@iit.vn',
            },
          },
          update: {
            name: 'IIT JSC',
            email: 'info@iit.vn',
            gender: 'OTHER',
            dateOfBirth: new Date('2023-01-01'),
            image: 'uploads/users/default',
          },
          create: {
            name: 'IIT JSC',
            email: 'info@iit.vn',
            gender: 'OTHER',
            dateOfBirth: new Date('2023-01-01'),
            image: 'uploads/users/default',
          },
        },
      },
      roles: {
        connect: [
          {
            id: admin.id,
          },
        ],
      },
    },
    create: {
      email: 'info@iit.vn',
      profile: {
        create: {
          name: 'IIT JSC',
          email: 'info@iit.vn',
          gender: 'OTHER',
          dateOfBirth: new Date('2023-01-01'),
          image: 'uploads/users/default',
        },
      },
      roles: {
        connect: [
          {
            id: admin.id,
          },
        ],
      },
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
