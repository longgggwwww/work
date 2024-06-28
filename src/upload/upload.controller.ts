import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import * as path from 'path';
import { Public } from 'src/public.decorator';
import { DIR_UPLOAD_AVATAR } from 'src/user/user.constance';

@Controller('uploads')
export class UploadController {
  @Public()
  @Get('avatars/:image')
  getImage(@Param('image') image: string, @Res() res: Response) {
    try {
      const file = path.join(process.cwd(), DIR_UPLOAD_AVATAR, image);
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
