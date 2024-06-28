import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  employeeId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dob?: string | Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsEnum($Enums.Gender)
  gender?: $Enums.Gender;

  @ApiProperty()
  @IsNumber()
  roleId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  branchId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  departmentId?: number;
}
