import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Address {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  ward: string;
}

export class CreateBranchDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ApiProperty()
  @IsString()
  provinceCode: string;

  @ApiProperty()
  @IsString()
  districtCode: string;

  @ApiProperty()
  @IsString()
  wardCode: string;

  @ApiProperty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    { each: true },
  )
  employeeIds?: number[];
}
