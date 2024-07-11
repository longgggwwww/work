import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { SettingService } from './setting.service';

@ApiTags('Setting')
@ApiBearerAuth()
@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @RequirePermissions(Permission.ModifySetting)
  @Get()
  get() {
    return this.settingService.get();
  }

  @RequirePermissions(Permission.ModifySetting)
  @Patch()
  upsert(@Body() upsertSettingDto: UpsertSettingDto) {
    return this.settingService.upsert(upsertSettingDto);
  }
}
