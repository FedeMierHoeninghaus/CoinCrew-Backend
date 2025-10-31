import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
export declare class ChecksController {
    private readonly checksService;
    constructor(checksService: ChecksService);
    create(createCheckDto: CreateCheckDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCheckDto: UpdateCheckDto): string;
    remove(id: string): string;
}
