import { CreateUserTransactionDto } from './dto/create-user-transaction.dto';
import { UpdateUserTransactionDto } from './dto/update-user-transaction.dto';
export declare class UserTransactionService {
    create(createUserTransactionDto: CreateUserTransactionDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserTransactionDto: UpdateUserTransactionDto): string;
    remove(id: number): string;
}
