import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { CompanyRegistrationRequestModule } from './company-registration-request/company-registration-request.module';
import { CompanyModule } from './company/company.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { SettingModule } from './setting/setting.module';
import { UploadModule } from './uploading/uploading.module';
import { UserRegistrationRequestModule } from './user-registration-request/user-registration-request.module';
import { UserModule } from './user/user.module';

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
    UserRegistrationRequestModule,
    CompanyRegistrationRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
