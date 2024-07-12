import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from 'nestjs-prisma';
import { PositionController } from './position.controller';
import { PositionGuard } from './position.guard';
import { PositionService } from './position.service';

@Module({
  controllers: [PositionController],
  providers: [
    PositionService,
    PrismaService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: PositionGuard,
    },
  ],
})
export class PositionModule {}
