import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpsertSettingDto } from './dto/upsert-setting.dto';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async get() {
    return this.prisma.setting.findFirst();
  }

  async upsert(upsertSettingDto: UpsertSettingDto) {
    const { gender, roleId } = upsertSettingDto;
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!role) {
      throw new BadRequestException();
    }

    const setting = await this.prisma.setting.upsert({
      where: { id: 1 },
      update: {
        roleId,
        gender,
      },
      create: {
        roleId,
        gender,
      },
      include: {
        role: true,
      },
    });
    return setting;
  }
}
