import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import * as path from 'path';
import { DIR_UPLOAD_COMPANY_IMAGE } from 'src/company/company.constants';
import { Public } from 'src/public.decorator';
import { DIR_UPLOAD_USER_IMAGE } from 'src/user/user.constants';

@ApiTags('Serving Files')
@ApiBearerAuth()
@ApiBadRequestResponse()
@ApiInternalServerErrorResponse()
@Controller('uploads')
export class UploadController {
  @Public()
  @Get('avatars/:image')
  getImage(@Param('image') image: string, @Res() res: Response) {
    try {
      const file = path.join(process.cwd(), DIR_UPLOAD_USER_IMAGE, image);
      if (!existsSync(file)) {
        throw new BadRequestException();
      }
      const stream = createReadStream(file);
      stream.pipe(res);
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  @Public()
  @Get('companies/:image')
  getLogoCompany(@Param('image') image: string, @Res() res: Response) {
    try {
      const file = path.join(process.cwd(), DIR_UPLOAD_COMPANY_IMAGE, image);
      if (!existsSync(file)) {
        throw new BadRequestException();
      }
      const stream = createReadStream(file);
      stream.pipe(res);
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }
}
