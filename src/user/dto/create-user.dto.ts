import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateAddressUnitDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  code: number;
}

class CreateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateAddressUnitDto)
  province: CreateAddressUnitDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateAddressUnitDto)
  district: CreateAddressUnitDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateAddressUnitDto)
  ward: CreateAddressUnitDto;
}

class IdCard {
  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsString()
  issuePlace: string;

  @ApiProperty()
  @IsDate()
  issueDate: Date;
}

export class CreateUserProfileDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEnum($Enums.Gender)
  gender: $Enums.Gender;

  @ApiProperty()
  @IsDate()
  dateOfBirth: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  insurance?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taxCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => IdCard)
  idCard?: IdCard;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateUserProfileDto)
  @IsNotEmptyObject()
  profile: CreateUserProfileDto;

  @ApiProperty()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    { each: true },
  )
  roleIds: number[];
}
