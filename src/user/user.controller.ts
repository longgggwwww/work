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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { User, UserType } from 'src/auth/decorators/user.decorator';
import { Public } from 'src/public.decorator';
import { UploadUserImgPipe } from 'src/user/upload.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto, UpdateUserProfileDto } from './dto/update-user.dto';
import { DIR_UPLOAD_USER_IMG } from './user.constance';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Require Bearer Token' })
@ApiResponse({ status: 403, description: 'Permission Denied' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
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
      new UploadUserImgPipe(DIR_UPLOAD_USER_IMG, { width: 500, height: 500 }),
    )
    image: string,
  ) {
    const user = await this.userService.findOne(id);
    const file = path.join(process.cwd(), user.profile.image);
    if (user.profile.image) {
      if (existsSync(file)) {
        await unlink(file);
      }
    }
    const userProfile = await this.userService.updateUserProfile(id, {
      image: path.join(DIR_UPLOAD_USER_IMG, image),
    });
    return userProfile;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findMany(@Query() findManyUserDto: FindUserDto) {
    return this.userService.findMany(findManyUserDto);
  }

  @Get('me')
  findMe(@User() user: UserType) {
    return this.userService.findOne(user.id);
  }

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

  @Patch(':id/profile')
  updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(id, updateProfileDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('batch')
  async removeMany(
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
