import { ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpsertSettingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiPropertyOptional({ enum: $Enums.Gender })
  @IsOptional()
  @IsEnum($Enums.Gender)
  gender?: $Enums.Gender;
}
