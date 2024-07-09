import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './public.decorator';

@ApiTags('Public')
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse()
  @Get()
  ping() {
    return this.appService.ping();
  }

  @ApiOkResponse()
  @Get('v')
  getVersion() {
    return this.appService.getVersion();
  }
}
