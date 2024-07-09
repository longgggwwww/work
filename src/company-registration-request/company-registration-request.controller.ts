import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User, UserType } from 'src/auth/decorators/user.decorator';
import { CompanyRegistrationRequestService } from './company-registration-request.service';
import { CreateCompanyRegistrationRequestDto } from './dto/create-company-registration-request.dto';
import { FindCompanyRegistrationRequestDto } from './dto/find-company-registration-request.dto';
import { UpdateCompanyRegistrationRequestDto } from './dto/update-company-registration-request.dto';

@ApiTags('Company Registration Request')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiInternalServerErrorResponse()
@Controller('company-registration-requests')
export class CompanyRegistrationRequestController {
  constructor(
    private readonly companyRegistrationRequestService: CompanyRegistrationRequestService,
  ) {}

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @Post()
  create(
    @User() user: UserType,
    @Body()
    createCompanyRegistrationRequestDto: CreateCompanyRegistrationRequestDto,
  ) {
    return this.companyRegistrationRequestService.create(
      user.id,
      createCompanyRegistrationRequestDto,
    );
  }

  @ApiOkResponse()
  @Get()
  findAll(
    @Query()
    findCompanyRegistrationRequestDto: FindCompanyRegistrationRequestDto,
  ) {
    return this.companyRegistrationRequestService.findAll(
      findCompanyRegistrationRequestDto,
    );
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyRegistrationRequestService.findOne(id);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateCompanyRegistrationRequestDto: UpdateCompanyRegistrationRequestDto,
  ) {
    return this.companyRegistrationRequestService.update(
      id,
      updateCompanyRegistrationRequestDto,
    );
  }
}
