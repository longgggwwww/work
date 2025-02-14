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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { existsSync, unlinkSync } from 'fs';
import * as path from 'path';
import { User, UserType } from 'src/auth/decorators/user.decorator';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { Public } from 'src/public.decorator';
import { UploadImagePipe } from 'src/uploading/upload.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto, UpdateUserProfileDto } from './dto/update-user.dto';
import { DIR_UPLOAD_USER_IMAGE } from './user.constants';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
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
      new UploadImagePipe(DIR_UPLOAD_USER_IMAGE, { width: 500, height: 500 }),
    )
    image: string,
  ) {
    const user = await this.userService.findOne(id);
    if (user.profile.image) {
      const file = path.join(process.cwd(), user.profile.image);
      if (existsSync(file)) {
        unlinkSync(file);
      }
    }
    const userProfile = await this.userService.updateUserProfile(id, {
      image: path.join(DIR_UPLOAD_USER_IMAGE, image),
    });
    return userProfile;
  }

  @RequirePermissions(Permission.CreateAndModifyUser)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @RequirePermissions(Permission.GetUser, Permission.CreateAndModifyUser)
  @Get()
  findMany(@Query() findUserDto: FindUserDto) {
    return this.userService.findMany(findUserDto);
  }

  @Get('me')
  findMe(@User() user: UserType) {
    return this.userService.findOne(user.id);
  }

  @RequirePermissions(Permission.GetUser, Permission.CreateAndModifyUser)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch('my-profile')
  updateMyProfile(
    @User() user: UserType,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(user.id, updateProfileDto);
  }

  @RequirePermissions(Permission.CreateAndModifyUser)
  @Patch(':id/profile')
  updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(id, updateProfileDto);
  }

  @RequirePermissions(Permission.CreateAndModifyUser)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @RequirePermissions(Permission.DeleteUser)
  @Delete('batch')
  async deleteMany(
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
    return this.userService.deleteMany(ids);
  }

  @RequirePermissions(Permission.DeleteUser)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
