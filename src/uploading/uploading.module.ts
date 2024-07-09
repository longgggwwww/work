import { Module } from '@nestjs/common';
import { UploadController } from './uploading.controller';

@Module({
  controllers: [UploadController],
})
export class UploadModule {}
