import { UserService } from './user.service';
import { UserTransactionDto } from './DTOs/user-transaction.dto';
import { CreateTransactionForUserDto } from './DTOs/create-transaction-for-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(user: {
        userId: string;
        email: string;
    }): Promise<any>;
    createTransaction(userId: string, userTransactionDto: UserTransactionDto): Promise<any>;
    getUserTransactions(userId: string): Promise<any[]>;
    findAll(): Promise<any[]>;
    createTransactionForUser(createTransactionDto: CreateTransactionForUserDto): Promise<any>;
}
