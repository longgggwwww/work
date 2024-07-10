import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseArrayPipe,
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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { existsSync, unlinkSync } from 'fs';
import * as path from 'path';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { UploadImagePipe } from 'src/uploading/upload.pipe';
import { DIR_UPLOAD_COMPANY_IMAGE } from './company.constants';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { findCompanyDto } from './dto/find-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Company')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiInternalServerErrorResponse()
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @RequirePermissions(Permission.CreateCompany)
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
      new UploadImagePipe(DIR_UPLOAD_COMPANY_IMAGE, {
        width: 500,
        height: 500,
      }),
    )
    image: string,
  ) {
    const { logo } = await this.companyService.findOne(id);
    if (logo) {
      const file = path.join(process.cwd(), logo);
      if (existsSync(file)) {
        unlinkSync(file);
      }
    }
    const company = await this.companyService.update(id, {
      logo: path.join(DIR_UPLOAD_COMPANY_IMAGE, image),
    });
    return company;
  }

  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @RequirePermissions(Permission.CreateCompany)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @ApiOkResponse()
  @RequirePermissions(Permission.GetCompany)
  @Get()
  findMany(@Query() findManyCompanyDto: findCompanyDto) {
    return this.companyService.findMany(findManyCompanyDto);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @RequirePermissions(Permission.GetCompany)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @RequirePermissions(Permission.UpdateCompany)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @RequirePermissions(Permission.DeleteCompany)
  @Delete('batch')
  deleteMany(
    @Body(
      new ParseArrayPipe({
        items: Number,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    )
    ids: number[],
  ) {
    return this.companyService.deleteMany(ids);
  }

  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @RequirePermissions(Permission.DeleteCompany)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.delete(id);
  }
}
