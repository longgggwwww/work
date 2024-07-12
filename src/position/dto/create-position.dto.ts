import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePositionDto {
  @ApiProperty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiPropertyOptional()
  @IsString()
  color?: string;

  @ApiProperty({ isArray: true })
  @IsString({ each: true })
  functions: string[];
}
