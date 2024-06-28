import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(args: Prisma.UserCreateArgs) {
    return await this.prisma.user.create(args);
  }

  async findMany(args: Prisma.UserFindManyArgs) {
    return await this.prisma.user.findMany(args);
  }

  async findUnique(args: Prisma.UserFindUniqueArgs) {
    return await this.prisma.user.findUnique(args);
  }

  async update(args: Prisma.UserUpdateArgs) {
    return await this.prisma.user.update(args);
  }

  async delete(args: Prisma.UserDeleteArgs) {
    return await this.prisma.user.delete(args);
  }

  async deleteMany(args: Prisma.UserDeleteManyArgs) {
    return await this.prisma.user.deleteMany(args);
  }

  async register() {
    return 'register';
  }
}
