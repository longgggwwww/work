import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import * as path from 'path';
import { DIR_UPLOAD_COMPANY_REGISTRATION_REQUEST_IMAGE } from 'src/company-registration-request/company-registration-request.constants';
import { DIR_UPLOAD_COMPANY_IMAGE } from 'src/company/company.constants';
import { Public } from 'src/public.decorator';
import { DIR_UPLOAD_USER_IMAGE } from 'src/user/user.constants';
import { UploadingService } from './uploading.service';

@ApiTags('Serving Files')
@ApiBearerAuth()
@Public()
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadingService: UploadingService) {}

  @Get('users/:image')
  getUserImage(@Param('image') image: string, @Res() res: Response) {
    try {
      const file = path.join(process.cwd(), DIR_UPLOAD_USER_IMAGE, image);
      if (!existsSync(file)) {
        throw new NotFoundException();
      }
      const stream = createReadStream(file);
      stream.pipe(res);
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  @Get('companies/:image')
  getCompanyLogo(@Param('image') image: string, @Res() res: Response) {
    try {
      const file = path.join(process.cwd(), DIR_UPLOAD_COMPANY_IMAGE, image);
      if (!existsSync(file)) {
        throw new NotFoundException();
      }
      const stream = createReadStream(file);
      stream.pipe(res);
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  @Get('company-registration-requests/:image')
  getCompanyRegistrationRequestLogo(
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    try {
      const file = path.join(
        process.cwd(),
        DIR_UPLOAD_COMPANY_REGISTRATION_REQUEST_IMAGE,
        image,
      );
      if (!existsSync(file)) {
        throw new NotFoundException();
      }
      const stream = createReadStream(file);
      stream.pipe(res);
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }
}
