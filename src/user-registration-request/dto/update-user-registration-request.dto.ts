import { ApiProperty, PartialType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { CreateUserRegistrationRequestDto } from './create-user-registration-request.dto';

export class UpdateUserRegistrationRequestDto extends PartialType(
  CreateUserRegistrationRequestDto,
) {
  @ApiProperty()
  @IsString()
  idToken: string;
}

export class ReviewUserRegistrationRequestDto {
  @ApiProperty({
    enum: $Enums.UserRegistrationRequestStatus,
  })
  @IsEnum($Enums.UserRegistrationRequestStatus)
  status: $Enums.UserRegistrationRequestStatus;
}
