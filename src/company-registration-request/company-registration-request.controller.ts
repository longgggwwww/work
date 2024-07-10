import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { existsSync, unlinkSync } from 'fs';
import * as path from 'path';
import { User, UserType } from 'src/auth/decorators/user.decorator';
import { UploadImagePipe } from 'src/uploading/upload.pipe';
import { DIR_UPLOAD_COMPANY_REGISTRATION_REQUEST_IMAGE } from './company-registration-request.constants';
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

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 8 * Math.pow(1024, 2) }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|gif|bmp|webp|tiff)$/i,
          }),
        ],
      }),
      new UploadImagePipe(DIR_UPLOAD_COMPANY_REGISTRATION_REQUEST_IMAGE, {
        width: 500,
        height: 500,
      }),
    )
    image: string,
  ) {
    const { logo } = await this.companyRegistrationRequestService.findOne(id);
    const file = path.join(process.cwd(), logo);
    if (logo) {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    }
    const request = await this.companyRegistrationRequestService.update(id, {
      logo: path.join(DIR_UPLOAD_COMPANY_REGISTRATION_REQUEST_IMAGE, image),
    });
    return request;
  }

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
