import { DatabaseService } from 'src/database/database.service';
import { UserTransactionDto } from './DTOs/user-transaction.dto';
import { FundService } from 'src/fund/fund.service';
export declare class UserService {
    private readonly databaseService;
    private readonly fundService;
    constructor(databaseService: DatabaseService, fundService: FundService);
    validateUser(email: string, password: string): Promise<any>;
    getUserById(userId: string): Promise<any>;
    createTransaction(userId: string, userTransactionDto: UserTransactionDto): Promise<any>;
}
