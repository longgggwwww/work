import { Module } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoGateway } from './demo.gateway';

@Module({
  providers: [DemoGateway, DemoService],
})
export class DemoModule {}
