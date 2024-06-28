import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller({
  path: 'users',
  version: 'public',
})
export class PublicUserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerUserDto: CreateUserDto) {
    return this.userService.register();
  }
}
