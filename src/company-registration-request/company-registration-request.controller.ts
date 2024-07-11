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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { existsSync, unlinkSync } from 'fs';
import * as path from 'path';
import { User, UserType } from 'src/auth/decorators/user.decorator';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { UploadImagePipe } from 'src/uploading/upload.pipe';
import { DIR_UPLOAD_COMPANY_REGISTRATION_REQUEST_IMAGE } from './company-registration-request.constants';
import { CompanyRegistrationRequestService } from './company-registration-request.service';
import { CreateCompanyRegistrationRequestDto } from './dto/create-company-registration-request.dto';
import { FindCompanyRegistrationRequestDto } from './dto/find-company-registration-request.dto';
import {
  ApproveCompanyRegistrationRequestDto,
  UpdateCompanyRegistrationRequestDto,
} from './dto/update-company-registration-request.dto';

@ApiTags('Company Registration Request')
@ApiBearerAuth()
@Controller('company-registration-requests')
export class CompanyRegistrationRequestController {
  constructor(
    private readonly companyRegistrationRequestService: CompanyRegistrationRequestService,
  ) {}

  @RequirePermissions(Permission.RegisterCompany)
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @User() user: UserType,
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
    if (logo) {
      const file = path.join(process.cwd(), logo);
      if (existsSync(file)) {
        unlinkSync(file);
      }
    }
    const request = await this.companyRegistrationRequestService.update(
      user.id,
      id,
      { logo: path.join(DIR_UPLOAD_COMPANY_REGISTRATION_REQUEST_IMAGE, image) },
    );
    return request;
  }

  @RequirePermissions(Permission.RegisterCompany)
  @Post()
  register(
    @User() user: UserType,
    @Body()
    registerCompanyRegistrationRequestDto: CreateCompanyRegistrationRequestDto,
  ) {
    return this.companyRegistrationRequestService.register(
      user.id,
      registerCompanyRegistrationRequestDto,
    );
  }

  @RequirePermissions(
    Permission.RegisterCompany,
    Permission.GetCompanyRegistrationRequest,
    Permission.ApproveCompanyRegistrationRequest,
  )
  @Get()
  findMany(
    @Query()
    findCompanyRegistrationRequestDto: FindCompanyRegistrationRequestDto,
  ) {
    return this.companyRegistrationRequestService.findMany(
      findCompanyRegistrationRequestDto,
    );
  }

  @RequirePermissions(
    Permission.RegisterCompany,
    Permission.GetCompanyRegistrationRequest,
    Permission.ApproveUserRegistrationRequest,
  )
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyRegistrationRequestService.findOne(id);
  }

  @RequirePermissions(Permission.ApproveCompanyRegistrationRequest)
  @Patch(':id/approval')
  approveRequest(
    @User() user: UserType,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    approveCompanyRegistrationRequest: ApproveCompanyRegistrationRequestDto,
  ) {
    return this.companyRegistrationRequestService.approveRequest(
      user.id,
      id,
      approveCompanyRegistrationRequest,
    );
  }

  @RequirePermissions(Permission.RegisterCompany)
  @Patch(':id')
  update(
    @User() user: UserType,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateCompanyRegistrationRequestDto: UpdateCompanyRegistrationRequestDto,
  ) {
    return this.companyRegistrationRequestService.update(
      user.id,
      id,
      updateCompanyRegistrationRequestDto,
    );
  }
}
