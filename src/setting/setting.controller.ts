import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { SettingService } from './setting.service';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  get() {
    return this.settingService.get({
      include: {
        role: true,
      },
    });
  }

  @Patch()
  upsert(@Body() upsertSettingDto: UpsertSettingDto) {
    return this.settingService.upsert({
      where: { id: 1 },
      create: {
        roleId: upsertSettingDto.roleId,
        gender: upsertSettingDto.gender,
      },
      update: {
        roleId: upsertSettingDto.roleId,
        gender: upsertSettingDto.gender,
      },
      include: {
        role: true,
      },
    });
  }
}
