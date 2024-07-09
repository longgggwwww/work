import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SettingService } from 'src/setting/setting.service';
import { UserRegistrationRequestController } from './user-registration-request.controller';
import { UserRegistrationRequestService } from './user-registration-request.service';

@Module({
  controllers: [UserRegistrationRequestController],
  providers: [UserRegistrationRequestService, PrismaService, SettingService],
})
export class UserRegistrationRequestModule {}
