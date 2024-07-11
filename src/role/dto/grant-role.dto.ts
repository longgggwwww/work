import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GrantRoleDto {
  @ApiProperty()
  @IsNumber()
  roleId: number;

  @ApiProperty()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    { each: true },
  )
  userIds: number[];
}
