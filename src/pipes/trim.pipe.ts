import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(val: any) {
    Object.keys(val).forEach((key) => {
      if (key !== 'password') {
        if (this.isObj(val[key])) {
          val[key] = this.trim(val[key]);
        } else {
          if (typeof val[key] === 'string') {
            val[key] = val[key].trim();
          }
        }
      }
    });
    return val;
  }

  transform(vals: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body') {
      if (this.isObj(vals)) {
        return this.trim(vals);
      }
      throw new BadRequestException('Validation failed');
    }
    return vals;
  }
}
