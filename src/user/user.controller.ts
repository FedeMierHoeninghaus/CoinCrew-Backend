import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {GetUser} from 'src/auth/decorators/get-user.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    //-----------get user by id-----------------------
    @UseGuards(JwtAuthGuard)
    @Get('getUser')
    async getUser(@GetUser() user: {userId: string, email: string}){
        const userId = user.userId;
        console.log("llegamos a getUser", {user});
        console.log("userId", userId.toString());
        return this.userService.getUserById(userId.toString());
    }
}
