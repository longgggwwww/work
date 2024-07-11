import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator';

export class FindCompanyRegistrationRequestDto {
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
  field?: Prisma.CompanyScalarFieldEnum =
    Prisma.CompanyScalarFieldEnum.updatedAt;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  order?: Prisma.SortOrder = Prisma.SortOrder.desc;
}
