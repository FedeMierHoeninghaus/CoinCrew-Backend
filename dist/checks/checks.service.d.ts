import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { DatabaseService } from 'src/database/database.service';
export declare class ChecksService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createCheckDto: CreateCheckDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateCheckDto: UpdateCheckDto): Promise<any>;
    private handleCompleteRecoveryProfitDistribution;
    remove(id: number): string;
    getMovements(id: string): Promise<any[]>;
    getCheckRecoveries(checkId: string): Promise<{
        recoveries: any[];
        totalRecovered: number;
    }>;
}
