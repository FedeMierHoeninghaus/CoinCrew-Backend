import { DatabaseService } from 'src/database/database.service';
import { UserTransactionDto } from './DTOs/user-transaction.dto';
import { FundService } from 'src/fund/fund.service';
import { CreateTransactionForUserDto } from './DTOs/create-transaction-for-user.dto';
export declare class UserService {
    private readonly databaseService;
    private readonly fundService;
    constructor(databaseService: DatabaseService, fundService: FundService);
    createUser(first_name: string, last_name: string, email: string, password: string): Promise<any>;
    validateUser(email: string, password: string): Promise<any>;
    getUserById(userId: string): Promise<any>;
    createTransaction(userId: string, userTransactionDto: UserTransactionDto): Promise<any>;
    getUserTransactions(userId: string): Promise<any[]>;
    findAll(): Promise<any[]>;
    createTransactionForUser(createTransactionDto: CreateTransactionForUserDto): Promise<any>;
}
