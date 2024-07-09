import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CompanyRegistrationRequestController } from './company-registration-request.controller';
import { CompanyRegistrationRequestService } from './company-registration-request.service';

@Module({
  controllers: [CompanyRegistrationRequestController],
  providers: [CompanyRegistrationRequestService, PrismaService],
})
export class CompanyRegistrationRequestModule {}
