import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator';

export class FindUserDto {
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
  @IsIn(Object.keys(Prisma.UserScalarFieldEnum))
  field?: Prisma.UserScalarFieldEnum = Prisma.UserScalarFieldEnum.id;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  order?: Prisma.SortOrder = Prisma.SortOrder.desc;
}
