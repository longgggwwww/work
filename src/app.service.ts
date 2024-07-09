import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping() {
    return 'OK';
  }

  getVersion() {
    return '1.0.1';
  }
}
