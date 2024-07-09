import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsDate, IsEnum, IsString } from 'class-validator';

export class CreateUserRegistrationRequestDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: $Enums.Gender })
  @IsEnum($Enums.Gender)
  gender: $Enums.Gender;

  @ApiProperty()
  @IsDate()
  dateOfBirth: Date;
}
