import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindManyRoleDto } from './dto/find-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create({
      data: {
        name: createRoleDto.name,
        slug: createRoleDto.slug,
        permissions: createRoleDto.permissions,
      },
      include: {
        users: true,
      },
    });
  }

  @Get()
  findMany(@Query() { id, take, skip, field, order }: FindManyRoleDto) {
    return this.roleService.findMany({
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [field]: order,
      },
      include: {
        users: true,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name, slug, permissions }: UpdateRoleDto,
  ) {
    return this.roleService.update({
      where: { id },
      data: {
        name,
        slug,
        permissions,
      },
      include: {
        users: true,
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
    return this.roleService.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete({
      where: { id },
      include: {
        users: true,
      },
    });
  }
}
