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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { AllocRoleDto } from './dto/alloc-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindRoleDto } from './dto/find-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiInternalServerErrorResponse()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @RequirePermissions(Permission.CreateRole)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOkResponse()
  @RequirePermissions(Permission.GetRole)
  @Get()
  findMany(@Query() findRoleDto: FindRoleDto) {
    return this.roleService.findMany(findRoleDto);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @RequirePermissions(Permission.GetRole)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @RequirePermissions(Permission.AllocRoleToUsers)
  @Patch('connect-role')
  connectRole(@Body() connectRoleDto: AllocRoleDto) {
    return this.roleService.connectRole(connectRoleDto);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @RequirePermissions(Permission.AllocRoleToUsers)
  @Patch('disconnect-role')
  disconnectRole(@Body() disconnectRoleDto: AllocRoleDto) {
    return this.roleService.disconnectRole(disconnectRoleDto);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @RequirePermissions(Permission.UpdateRole)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @RequirePermissions(Permission.UpdateRole)
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
    return this.roleService.deleteMany(ids);
  }

  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.UpdateRole)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }
}
