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
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as admin from 'firebase-admin';
import { User, UserType } from 'src/auth/decorators/user.decorator';
import { Public } from 'src/public.decorator';
import { UploadUserImgPipe } from 'src/user/upload.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { FindManyUserDto } from './dto/find-user.dto';
import { UpdateProfileDto, UpdateUserDto } from './dto/update-user.dto';
import { DIR_UPLOAD_AVATAR } from './user.constance';
import { UserService } from './user.service';

@Controller({
  path: 'users',
  version: VERSION_NEUTRAL,
})
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
      new UploadUserImgPipe(DIR_UPLOAD_AVATAR, { width: 500, height: 500 }),
    )
    image: string,
  ) {
    let user = await this.userService.findUnique({
      where: { id },
    });

    user = await this.userService.update({
      where: { id },
      data: {},
      include: {
        accounts: true,
        roles: true,
        branch: true,
        department: true,
        departments: true,
      },
    });
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await admin.auth().createUser({
      email: createUserDto.email,
      password: createUserDto.password,
      displayName: createUserDto.name,
    });
    return this.userService.create({
      data: createUserDto,
      include: {
        accounts: true,
        roles: true,
        branch: true,
        department: true,
        departments: true,
      },
    });
  }

  @Post('owner')
  createOwner(@Body() createUserDto: CreateUserDto) {}

  @Get()
  findMany(@Query() findManyUserDto: FindManyUserDto) {
    return this.userService.findMany({
      cursor: findManyUserDto.id && {
        id: findManyUserDto.id,
      },
      take: findManyUserDto.take,
      skip: findManyUserDto.skip,
      orderBy: findManyUserDto.field && {
        [findManyUserDto.field]: findManyUserDto.order,
      },
      include: {
        accounts: true,
        roles: true,
        branch: true,
        department: true,
        departments: true,
      },
    });
  }

  @Get('me')
  findMe(@User() user: UserType) {
    return this.userService.findUnique({
      where: {
        id: user.id,
      },
      include: {
        accounts: true,
        roles: true,
        branch: true,
        department: true,
        departments: true,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUnique({
      where: { id },
      include: {
        accounts: true,
        roles: true,
        branch: true,
        department: true,
        departments: true,
      },
    });
  }

  @Patch('profile')
  updateProfile(
    @User() user: UserType,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.update({
      where: { id: user.id },
      data: {},
      include: {
        accounts: true,
        roles: true,
        branch: true,
        department: true,
        departments: true,
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update({
      where: { id },
      data: updateUserDto,
      include: {
        accounts: true,
        roles: true,
        branch: true,
        department: true,
        departments: true,
      },
    });
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
    return this.userService.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete({
      where: { id },
      include: {
        accounts: true,
        roles: true,
        branch: true,
        department: true,
        departments: true,
      },
    });
  }
}
