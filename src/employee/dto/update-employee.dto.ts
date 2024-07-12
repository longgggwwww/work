import { PartialType } from '@nestjs/swagger';
import { AddEmployeeDto } from './add-employee.dto';

export class UpdateEmployeeDto extends PartialType(AddEmployeeDto) {}
