import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async upsert(args: Prisma.SettingUpsertArgs) {
    return await this.prisma.setting.upsert(args);
  }

  async get(args: Prisma.SettingFindFirstArgs) {
    return await this.prisma.setting.findFirst(args);
  }
}
