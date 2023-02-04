import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CheckAuthGuard } from 'src/middleware/middleware.checkAuth';
import { createUserDto } from './dto/create-user.dto';
import { UserRegisterResponse, UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  create(
    @UploadedFiles() files,
    @Body() dto: createUserDto,
  ): Promise<UserRegisterResponse> {
    const { picture } = files;
    return this.userService.create(dto, picture ? picture[0] : null);
  }

  @Post('login')
  login(@Body() { email, password }) {
    return this.userService.login(email, password);
  }

  @Get('me')
  @UseGuards(CheckAuthGuard)
  getMe(@Req() req) {
    return this.userService.getMe(req.userId);
  }

  @Patch()
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  update(
    @UploadedFiles() files,
    @Body() dto: createUserDto,
    @Req() req,
  ): Promise<UserRegisterResponse> {
    const { picture } = files;
    const { userId } = req;
    return this.userService.update(dto, picture ? picture[0] : null, userId);
  }

  @Delete()
  @UseGuards(CheckAuthGuard)
  delete(@Req() req) {
    return this.userService.delete(req.userId);
  }
}
