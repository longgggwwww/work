import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
