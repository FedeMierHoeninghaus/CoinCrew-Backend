import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
export declare class ChecksController {
    private readonly checksService;
    constructor(checksService: ChecksService);
    create(createCheckDto: CreateCheckDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateCheckDto: UpdateCheckDto): Promise<any>;
    remove(id: string): string;
    getMovements(id: string): Promise<any[]>;
    getRecoveries(id: string): Promise<{
        recoveries: any[];
        totalRecovered: number;
    }>;
}
