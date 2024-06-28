import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpsertSettingDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'Vai trò mặc định khi tạo user',
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum($Enums.Gender)
  gender?: $Enums.Gender;
}
