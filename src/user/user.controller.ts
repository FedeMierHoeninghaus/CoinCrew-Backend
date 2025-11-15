import { Controller, Get, Param, Post, Query, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {GetUser} from 'src/auth/decorators/get-user.decorator';
import { UserTransactionDto } from './DTOs/user-transaction.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    //-----------get user by id-----------------------
    @UseGuards(JwtAuthGuard)
    @Get('getUser')
    async getUser(@GetUser() user: {userId: string, email: string}){
        const userId = user.userId;
        return this.userService.getUserById(userId.toString());
    }

    @Post(':id/transaction')
    createTransaction(@Param('id') userId: string, @Body() userTransactionDto: UserTransactionDto){
        return this.userService.createTransaction(userId, userTransactionDto);
    }

    @Get(':id/transactions')
    async getUserTransactions(@Param('id') userId: string){
        console.log("llegamos a getUserTransactions", {userId});
        return ;
    }
}
