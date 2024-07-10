import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { SettingService } from './setting.service';

@ApiTags('Setting')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiInternalServerErrorResponse()
@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiOkResponse()
  @RequirePermissions(Permission.GetSetting)
  @Get()
  get() {
    return this.settingService.get();
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @RequirePermissions(Permission.UpdateSetting)
  @Patch()
  upsert(@Body() upsertSettingDto: UpsertSettingDto) {
    return this.settingService.upsert(upsertSettingDto);
  }
}
