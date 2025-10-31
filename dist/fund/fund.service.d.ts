import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';
export declare class FundService {
    create(createFundDto: CreateFundDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFundDto: UpdateFundDto): string;
    remove(id: number): string;
}
