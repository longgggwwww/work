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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindRoleDto } from './dto/find-role.dto';
import { GrantRoleDto } from './dto/grant-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @RequirePermissions(Permission.CreateAndModifyRole)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @RequirePermissions(Permission.GetRole, Permission.CreateAndModifyRole)
  @Get()
  findMany(@Query() findRoleDto: FindRoleDto) {
    return this.roleService.findMany(findRoleDto);
  }

  @RequirePermissions(Permission.GetRole, Permission.CreateAndModifyRole)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @RequirePermissions(Permission.GrantRoleToUser)
  @Patch('grant')
  grantRole(@Body() grantRoleDto: GrantRoleDto) {
    return this.roleService.grantRole(grantRoleDto);
  }

  @RequirePermissions(Permission.GrantRoleToUser)
  @Patch('revoke')
  revokeRole(@Body() revokeRoleDto: GrantRoleDto) {
    return this.roleService.revokeRole(revokeRoleDto);
  }

  @RequirePermissions(Permission.CreateAndModifyRole)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @RequirePermissions(Permission.DeleteRole)
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

  @RequirePermissions(Permission.DeleteRole)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }
}
