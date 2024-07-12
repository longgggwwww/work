import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, UserType } from 'src/auth/decorators/user.decorator';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { CreatePositionDto } from './dto/create-position.dto';
import { FindPositionDto } from './dto/find-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { RequirePositions } from './position.decorator';
import { Position } from './position.enum';
import { PositionService } from './position.service';

@ApiTags('Position')
@ApiBearerAuth()
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @RequirePermissions(Permission.CreateAndModifyPosition)
  @Post('force')
  forceCreate(@Body() forceCreatePositionDto: CreatePositionDto) {
    return this.positionService.forceCreate(forceCreatePositionDto);
  }

  @RequirePositions(Position.CreateAndModifyPosition)
  @Post()
  create(@User() user: UserType, @Body() createPositionDto: CreatePositionDto) {
    return this.positionService.create(user.id, createPositionDto);
  }

  @RequirePermissions(
    Permission.GetPosition,
    Permission.CreateAndModifyCompany,
    Permission.DeletePosition,
  )
  @Get('force')
  forceFindMany(@Query() forceFindPositionDto: FindPositionDto) {
    return this.positionService.forceFindMany(forceFindPositionDto);
  }

  @RequirePositions(
    Position.GetPosition,
    Position.CreateAndModifyPosition,
    Position.GrantEmployeePosition,
    Position.RemoveEmployeeFromBranch,
  )
  @Get()
  findMany(@User() user: UserType, @Query() findPositionDto: FindPositionDto) {
    return this.positionService.findMany(user.id, findPositionDto);
  }

  @RequirePermissions(
    Permission.GetPosition,
    Permission.CreateAndModifyCompany,
    Permission.DeletePosition,
  )
  @Get('force/:id')
  forceFindOne(@Param('id', ParseIntPipe) id: number) {
    return this.positionService.forceFindOne(id);
  }

  @RequirePositions(
    Position.GetPosition,
    Position.CreateAndModifyPosition,
    Position.GrantEmployeePosition,
    Position.RemoveEmployeeFromBranch,
  )
  @Get(':id')
  findOne(@User() user: UserType, @Param('id', ParseIntPipe) id: number) {
    return this.positionService.findOne(user.id, id);
  }

  @RequirePermissions(Permission.CreateAndModifyPosition)
  @Patch('force/:id')
  forceUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() forceUpdatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.forceUpdate(id, forceUpdatePositionDto);
  }

  @RequirePositions(Position.CreateAndModifyPosition)
  @Patch(':id')
  update(
    @User() user: UserType,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.update(user.id, id, updatePositionDto);
  }

  @RequirePermissions(Permission.DeletePosition)
  @Delete('force/:id')
  forceDelete(@Param('id', ParseIntPipe) id: number) {
    return this.positionService.forceDelete(id);
  }

  @RequirePositions(Position.DeletePosition)
  @Delete(':id')
  delete(@User() user: UserType, @Param('id', ParseIntPipe) id: number) {
    return this.positionService.delete(user.id, id);
  }
}
