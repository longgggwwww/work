import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsDate, IsEnum, IsString } from 'class-validator';

export class CreateUserRegistrationRequestDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsDate()
  dateOfBirth: Date;
}
