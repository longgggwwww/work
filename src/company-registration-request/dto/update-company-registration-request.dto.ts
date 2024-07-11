import { ApiProperty, PartialType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { CreateCompanyRegistrationRequestDto } from './create-company-registration-request.dto';

export class UpdateCompanyRegistrationRequestDto extends PartialType(
  CreateCompanyRegistrationRequestDto,
) {}

export class ApproveCompanyRegistrationRequestDto {
  @ApiProperty({
    enum: $Enums.CompanyRegistrationRequestStatus,
  })
  @IsEnum($Enums.CompanyRegistrationRequestStatus)
  status: $Enums.CompanyRegistrationRequestStatus;
}
