import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpsertSettingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
