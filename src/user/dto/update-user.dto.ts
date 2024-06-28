import { ApiProperty, PartialType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dob?: string | Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum($Enums.Gender)
  gender?: $Enums.Gender;

  @ApiProperty()
  @IsOptional()
  @IsString()
  education?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  marital?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  national?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  idcardNumber?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  idcardIssueAt?: Date | string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  idcardIssueBy?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tax?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  insurance?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  provinceCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  districtCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  wardCode?: string;
}
