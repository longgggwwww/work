import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(args: Prisma.RoleCreateArgs) {
    return await this.prisma.role.create(args);
  }

  async findMany(args: Prisma.RoleFindManyArgs) {
    return await this.prisma.role.findMany(args);
  }

  async findUnique(args: Prisma.RoleFindUniqueArgs) {
    return await this.prisma.role.findUnique(args);
  }

  async update(args: Prisma.RoleUpdateArgs) {
    return await this.prisma.role.update(args);
  }

  async delete(args: Prisma.RoleDeleteArgs) {
    return await this.prisma.role.delete(args);
  }

  async deleteMany(args: Prisma.RoleDeleteManyArgs) {
    return await this.prisma.role.deleteMany(args);
  }
}
