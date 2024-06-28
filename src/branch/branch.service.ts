import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async create(args: Prisma.BranchCreateArgs) {
    return this.prisma.branch.create(args);
  }

  async findMany(args: Prisma.BranchFindManyArgs) {
    return this.prisma.branch.findMany(args);
  }

  async findUnique(args: Prisma.BranchFindUniqueArgs) {
    return this.prisma.branch.findUnique(args);
  }

  async update(args: Prisma.BranchUpdateArgs) {
    return this.prisma.branch.update(args);
  }

  async delete(args: Prisma.BranchDeleteArgs) {
    return this.prisma.branch.delete(args);
  }

  async deleteMany(args: Prisma.BranchDeleteManyArgs) {
    return this.prisma.branch.deleteMany(args);
  }
}
