import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUserDto, CreateUserProfileDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiHideProperty()
  @Exclude()
  @ValidateNested()
  @Type(() => CreateUserProfileDto)
  profile: CreateUserProfileDto;
}

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}
