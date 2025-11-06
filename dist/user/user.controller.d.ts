import { UserService } from './user.service';
import { UserTransactionDto } from './DTOs/user-transaction.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(user: {
        userId: string;
        email: string;
    }): Promise<any>;
    createTransaction(userId: string, userTransactionDto: UserTransactionDto): Promise<any>;
    getUserTransactions(userId: string): Promise<any[]>;
}
