import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { Public } from 'src/public.decorator';
import { FindUserRegistrationRequestDto } from './dto/find-user-registration-request.dto';
import {
  ApproveUserRegistrationRequestDto,
  UpdateUserRegistrationRequestDto,
} from './dto/update-user-registration-request.dto';
import { UserRegistrationRequestService } from './user-registration-request.service';

@ApiTags('User Registration Request')
@ApiBearerAuth()
@Controller('user-registration-requests')
export class UserRegistrationRequestController {
  constructor(
    private readonly userRegistrationRequestService: UserRegistrationRequestService,
  ) {}

  @RequirePermissions(
    Permission.GetUserRegistrationRequest,
    Permission.ApproveUserRegistrationRequest,
  )
  @Get()
  findMany(
    @Body() findUserRegistrationRequestDto: FindUserRegistrationRequestDto,
  ) {
    return this.userRegistrationRequestService.findMany(
      findUserRegistrationRequestDto,
    );
  }

  @RequirePermissions(
    Permission.GetUserRegistrationRequest,
    Permission.ApproveUserRegistrationRequest,
  )
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userRegistrationRequestService.findOne(id);
  }

  @Public()
  @Patch()
  update(
    @Body() updateUserRegistrationRequestDto: UpdateUserRegistrationRequestDto,
  ) {
    return this.userRegistrationRequestService.update(
      updateUserRegistrationRequestDto,
    );
  }

  @RequirePermissions(Permission.ApproveUserRegistrationRequest)
  @Patch(':id/approval')
  approveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    approveUserRegistrationRequestDto: ApproveUserRegistrationRequestDto,
  ) {
    return this.userRegistrationRequestService.approveRequest(
      id,
      approveUserRegistrationRequestDto,
    );
  }

  @RequirePermissions(Permission.DeleteUserRegistrationRequest)
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
    return this.userRegistrationRequestService.deleteMany(ids);
  }

  @RequirePermissions(Permission.DeleteUserRegistrationRequest)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userRegistrationRequestService.delete(id);
  }
}
