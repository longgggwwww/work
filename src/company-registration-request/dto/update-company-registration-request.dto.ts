import { PartialType } from '@nestjs/swagger';
import { CreateCompanyRegistrationRequestDto } from './create-company-registration-request.dto';

export class UpdateCompanyRegistrationRequestDto extends PartialType(
  CreateCompanyRegistrationRequestDto,
) {}
