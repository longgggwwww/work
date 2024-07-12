import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, UserType } from 'src/auth/decorators/user.decorator';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { FindEmployeeDto } from './dto/find-employee.dto';
import { EmployeeService } from './employee.service';

@ApiTags('Employee')
@ApiBearerAuth()
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @RequirePermissions(Permission.AddEmployee)
  @Post('force')
  addEmployeeForce(@Body() addEmployeeForceDto: AddEmployeeDto) {
    return this.employeeService.addEmployeeForce(addEmployeeForceDto);
  }

  @RequirePermissions(Permission.AddEmployee)
  @Post()
  addEmloyee(@User() user: UserType, @Body() addEmloyeeDto: AddEmployeeDto) {
    return this.employeeService.addEmployee(user.id, addEmloyeeDto);
  }

  @RequirePermissions(Permission.GetEmployee)
  @Get('by-employeeId/:companyId/:employeeId')
  findOneByEmployeeId(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('employeeId') employeeId: string,
  ) {
    return this.employeeService.findOneByEmployeeId(companyId, employeeId);
  }

  @RequirePermissions(Permission.GetEmployee)
  @Get('by-userId/:companyId/:userId')
  findOneByUserId(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('userId') userId: string,
  ) {
    return this.employeeService.findOneByEmployeeId(companyId, userId);
  }

  @RequirePermissions(Permission.GetEmployee)
  @Get(':companyId')
  findMany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query() findEmployeeDto: FindEmployeeDto,
  ) {
    return this.employeeService.findMany(companyId, findEmployeeDto);
  }

  @RequirePermissions(Permission.FireEmployee)
  @Delete(':companyId/:userId')
  fireEmployee(
    @User() user: UserType,
    @Param('companyId') companyId: number,
    @Param('userId') userId: number,
  ) {
    return this.employeeService.remove(user.id, companyId, userId);
  }
}
