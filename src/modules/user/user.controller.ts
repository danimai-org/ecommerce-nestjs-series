import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserParam } from '../../decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserUpdateDto } from './user.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @ApiOperation({ summary: 'get logged in user details' })
  async me(@UserParam() user: User) {
    return user;
  }

  @Patch('/me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update logged in user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'update logged in user',
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @UserParam() user: User,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() updateDto: UserUpdateDto,
  ) {
    return this.userService.update(user, avatar, updateDto);
  }
}
