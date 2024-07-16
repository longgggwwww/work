import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CompanyRegistrationRequestStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { CreateCompanyRegistrationRequestDto } from './create-company-registration-request.dto';

export class UpdateCompanyRegistrationRequestDto extends PartialType(
  CreateCompanyRegistrationRequestDto,
) {}

export class ApproveCompanyRegistrationRequestDto {
  @ApiProperty({
    enum: CompanyRegistrationRequestStatus,
  })
  @IsEnum(CompanyRegistrationRequestStatus)
  status: CompanyRegistrationRequestStatus;
}
