import { Gender, PrismaClient } from '@prisma/client';
import { Permission } from '../src/permission/permission.enum';

const prisma = new PrismaClient();

const roles = {
  admin: {
    name: 'Administrator',
    slug: 'admin',
    permissions: Object.values(Permission),
  },
  user: {
    name: 'User',
    slug: 'user',
    permissions: [],
  },
};

const rootUserInfo = {
  email: 'info@iit.vn',
  name: 'IIT JOINT STOCK COMPANY',
  gender: Gender.OTHER,
  dateOfBirth: new Date('2022-12-27'),
  image: 'uploads/users/default',
};

async function main() {
  const admin = await prisma.role.upsert({
    where: {
      slug: roles.admin.slug,
    },
    create: {
      name: roles.admin.name,
      slug: roles.admin.slug,
      permissions: roles.admin.permissions,
    },
    update: {
      name: roles.admin.name,
      slug: roles.admin.slug,
      permissions: roles.admin.permissions,
    },
  });
  const user = await prisma.role.upsert({
    where: {
      slug: roles.user.slug,
    },
    create: {
      name: roles.user.name,
      slug: roles.user.slug,
      permissions: roles.user.permissions,
    },
    update: {
      name: roles.user.name,
      slug: roles.user.slug,
      permissions: roles.user.permissions,
    },
  });

  await prisma.setting.upsert({
    where: { id: 1 },
    update: {
      roleId: user.id,
    },
    create: {
      roleId: user.id,
      gender: Gender.OTHER,
    },
  });

  const defaultUser = await prisma.user.upsert({
    where: {
      email: rootUserInfo.email,
    },
    update: {
      email: rootUserInfo.email,
      profile: {
        upsert: {
          where: {
            user: {
              email: rootUserInfo.email,
            },
          },
          update: {
            name: rootUserInfo.name,
            email: rootUserInfo.email,
            gender: rootUserInfo.gender,
            dateOfBirth: rootUserInfo.dateOfBirth,
            image: rootUserInfo.image,
          },
          create: {
            name: rootUserInfo.name,
            email: rootUserInfo.email,
            gender: rootUserInfo.gender,
            dateOfBirth: rootUserInfo.dateOfBirth,
            image: rootUserInfo.image,
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
      email: rootUserInfo.email,
      profile: {
        create: {
          name: rootUserInfo.name,
          email: rootUserInfo.email,
          gender: rootUserInfo.gender,
          dateOfBirth: rootUserInfo.dateOfBirth,
          image: rootUserInfo.image,
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
  console.log(defaultUser);
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
