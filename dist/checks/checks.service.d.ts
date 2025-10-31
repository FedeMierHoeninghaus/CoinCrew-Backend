import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
export declare class ChecksService {
    create(createCheckDto: CreateCheckDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCheckDto: UpdateCheckDto): string;
    remove(id: number): string;
}
