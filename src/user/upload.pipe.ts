import { Injectable, PipeTransform } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';

type Size = { width: number; height: number };

@Injectable()
export class UploadUserImgPipe implements PipeTransform<Express.Multer.File> {
  private path: string;
  private size: Size;

  constructor(path: string, size: Size) {
    this.path = path;
    this.size = size;
  }

  async transform(image: Express.Multer.File) {
    const filename = Date.now() + '-' + randomUUID();
    if (!existsSync(this.path)) {
      mkdirSync(this.path, { recursive: true });
    }
    await sharp(image.buffer)
      .resize({
        width: this.size.width,
        height: this.size.height,
      })
      .png()
      .toFile(join(this.path, filename));
    return filename;
  }
}
