import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Permission } from 'src/permission/permission.enum';
import { RequirePermissions } from 'src/permission/permissions.decorator';
import { FindUserRegistrationRequestDto } from './dto/find-user-registration-request.dto';
import {
  ReviewUserRegistrationRequestDto,
  UpdateUserRegistrationRequestDto,
} from './dto/update-user-registration-request.dto';
import { UserRegistrationRequestService } from './user-registration-request.service';

@ApiTags('User Registration Request')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiInternalServerErrorResponse()
@Controller('user-registration-requests')
export class UserRegistrationRequestController {
  constructor(
    private readonly userRegistrationRequestService: UserRegistrationRequestService,
  ) {}

  @ApiOkResponse()
  @RequirePermissions(Permission.GetUserRegistrationRequest)
  @Get()
  findMany(
    @Body() findUserRegistrationRequestDto: FindUserRegistrationRequestDto,
  ) {
    return this.userRegistrationRequestService.findMany(
      findUserRegistrationRequestDto,
    );
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @RequirePermissions(Permission.GetUserRegistrationRequest)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userRegistrationRequestService.findOne(id);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRegistrationRequestDto: UpdateUserRegistrationRequestDto,
  ) {
    return this.userRegistrationRequestService.update(
      id,
      updateUserRegistrationRequestDto,
    );
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @RequirePermissions(Permission.ReviewRegistrationRequest)
  @Patch(':id/approval')
  handleRequestApproval(
    @Param('id', ParseIntPipe) id: number,
    @Body() reviewUserRegistrationRequestDto: ReviewUserRegistrationRequestDto,
  ) {
    return this.userRegistrationRequestService.handleRequestApproval(
      id,
      reviewUserRegistrationRequestDto,
    );
  }
}
