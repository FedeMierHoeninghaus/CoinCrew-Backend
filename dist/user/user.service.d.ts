import { DatabaseService } from 'src/database/database.service';
import { UserTransactionDto } from './DTOs/user-transaction.dto';
export declare class UserService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    validateUser(email: string, password: string): Promise<any>;
    getUserById(userId: string): Promise<any>;
    createTransaction(userId: string, userTransactionDto: UserTransactionDto): Promise<any>;
    getUserTransactions(userId: string): Promise<any[]>;
}
