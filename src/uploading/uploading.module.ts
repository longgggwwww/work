import { Module } from '@nestjs/common';
import { UploadController } from './uploading.controller';
import { UploadingService } from './uploading.service';

@Module({
  controllers: [UploadController],
  providers: [UploadingService],
})
export class UploadModule {}
