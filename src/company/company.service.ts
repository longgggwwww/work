import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(args: Prisma.CompanyCreateArgs) {
    return await this.prisma.company.create(args);
  }

  async findMany(args: Prisma.CompanyFindManyArgs) {
    return await this.prisma.company.findMany(args);
  }

  async findUnique(args: Prisma.CompanyFindUniqueArgs) {
    return await this.prisma.company.findUnique(args);
  }

  async update(args: Prisma.CompanyUpdateArgs) {
    return await this.prisma.company.update(args);
  }

  async delete(args: Prisma.CompanyDeleteArgs) {
    return await this.prisma.company.delete(args);
  }

  async deleteMany(args: Prisma.CompanyDeleteManyArgs) {
    return await this.prisma.company.deleteMany(args);
  }
}
