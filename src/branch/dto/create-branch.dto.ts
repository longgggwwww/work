import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

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
