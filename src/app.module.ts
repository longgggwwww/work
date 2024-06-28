import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { CompanyModule } from './company/company.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { SettingModule } from './setting/setting.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    RoleModule,
    CompanyModule,
    BranchModule,
    PermissionModule,
    UserModule,
    SettingModule,
    UploadModule,
    DemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
