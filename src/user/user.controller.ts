import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    //users/me
    @Get('me')
    getMe(
        @GetUser() user: User) {
        return user;
    }


@Patch()
EditUser(
        @GetUser('id') userId: number,
        @Body() dto: EditUserDto,

    ) {
        return this.userService.editUer(userId, dto);
    }

}
