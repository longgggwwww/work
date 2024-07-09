import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsDate, IsEnum, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  idToken: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsDate()
  dateOfBirth: Date;
}
