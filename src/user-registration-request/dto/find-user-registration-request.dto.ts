import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator';

export class FindUserRegistrationRequestDto {
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

  @ApiPropertyOptional({ enum: Prisma.UserRegistrationRequestScalarFieldEnum })
  @IsOptional()
  @IsIn(Object.keys(Prisma.UserRegistrationRequestScalarFieldEnum))
  field?: Prisma.UserRegistrationRequestScalarFieldEnum =
    Prisma.UserRegistrationRequestScalarFieldEnum.updatedAt;

  @ApiPropertyOptional({ enum: Prisma.SortOrder })
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  order: Prisma.SortOrder = Prisma.SortOrder.desc;
}
