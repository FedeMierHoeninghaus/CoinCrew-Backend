import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { DatabaseService } from 'src/database/database.service';
export declare class ChecksService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createCheckDto: CreateCheckDto): Promise<any>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCheckDto: UpdateCheckDto): string;
    remove(id: number): string;
}
