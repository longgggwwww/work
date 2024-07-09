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
import { Public } from 'src/public.decorator';
import { DIR_UPLOAD_USER_IMG } from 'src/user/user.constance';

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
      const file = path.join(process.cwd(), DIR_UPLOAD_USER_IMG, image);
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
