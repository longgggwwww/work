import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator';

export class FindManyRoleDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  take?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  skip?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  order?: Prisma.SortOrder = Prisma.SortOrder.asc;

  @ApiProperty()
  @IsOptional()
  @IsIn(Object.keys(Prisma.RoleScalarFieldEnum))
  field?: Prisma.RoleScalarFieldEnum = Prisma.RoleScalarFieldEnum.name;
}
