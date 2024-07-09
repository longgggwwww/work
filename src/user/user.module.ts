import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MulterModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
