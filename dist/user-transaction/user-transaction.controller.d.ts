import { UserTransactionService } from './user-transaction.service';
import { CreateUserTransactionDto } from './dto/create-user-transaction.dto';
import { UpdateUserTransactionDto } from './dto/update-user-transaction.dto';
export declare class UserTransactionController {
    private readonly userTransactionService;
    constructor(userTransactionService: UserTransactionService);
    create(createUserTransactionDto: CreateUserTransactionDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUserTransactionDto: UpdateUserTransactionDto): string;
    remove(id: string): string;
}
