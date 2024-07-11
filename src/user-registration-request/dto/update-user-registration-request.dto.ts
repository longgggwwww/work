import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { CreateUserRegistrationRequestDto } from './create-user-registration-request.dto';

export class UpdateUserRegistrationRequestDto extends PartialType(
  CreateUserRegistrationRequestDto,
) {
  @ApiProperty()
  @IsString()
  idToken: string;

  @ApiHideProperty()
  @Exclude()
  email: string;
}

export class ApproveUserRegistrationRequestDto {
  @ApiProperty({
    enum: $Enums.UserRegistrationRequestStatus,
  })
  @IsEnum($Enums.UserRegistrationRequestStatus)
  status: $Enums.UserRegistrationRequestStatus;
}
