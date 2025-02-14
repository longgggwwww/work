import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindRoleDto } from './dto/find-role.dto';
import { GrantRoleDto } from './dto/grant-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name, slug, permissions } = createRoleDto;
    const role = await this.prisma.role.create({
      data: {
        name,
        slug,
        permissions,
      },
      include: {
        users: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
      },
    });
    return role;
  }

  async findMany(findRoleDto: FindRoleDto) {
    const { id, take, skip, field, order } = findRoleDto;
    const roles = await this.prisma.role.findMany({
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      include: {
        users: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
      },
    });
    return roles;
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUniqueOrThrow({
      where: { id },
      include: {
        users: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
      },
    });
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { name, slug, permissions } = updateRoleDto;
    const role = await this.prisma.role.update({
      where: { id },
      data: {
        name,
        slug,
        permissions,
      },
      include: {
        users: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
      },
    });
    return role;
  }

  async grantRole(grantRoleDto: GrantRoleDto) {
    const { roleId, userIds } = grantRoleDto;
    const role = await this.prisma.role.update({
      where: {
        id: roleId,
      },
      data: {
        users: {
          connect: userIds.map((id) => ({ id })),
        },
      },
      include: {
        users: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
      },
    });
    return role;
  }

  async revokeRole(revokeRole: GrantRoleDto) {
    const { roleId, userIds } = revokeRole;
    const role = await this.prisma.role.update({
      where: {
        id: roleId,
      },
      data: {
        users: {
          disconnect: userIds.map((id) => ({ id })),
        },
      },
      include: {
        users: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
      },
    });
    return role;
  }

  async delete(id: number) {
    const role = await this.prisma.role.delete({
      where: { id },
      include: {
        users: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
      },
    });
    return role;
  }

  async deleteMany(ids: number[]) {
    const result = await this.prisma.role.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return result;
  }
}
