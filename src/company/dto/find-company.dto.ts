import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator';

export class FindCompanyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  take?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  skip?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(Object.keys(Prisma.CompanyScalarFieldEnum))
  field?: Prisma.CompanyScalarFieldEnum = Prisma.CompanyScalarFieldEnum.name;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  order?: Prisma.SortOrder = Prisma.SortOrder.asc;
}
