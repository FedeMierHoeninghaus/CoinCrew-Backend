import { FundService } from './fund.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';
export declare class FundController {
    private readonly fundService;
    constructor(fundService: FundService);
    create(createFundDto: CreateFundDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateFundDto: UpdateFundDto): string;
    remove(id: string): string;
}
