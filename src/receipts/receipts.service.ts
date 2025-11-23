import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { ReceiptCurrency } from './Entities/receipt.entity';

@Injectable()
export class ReceiptsService {
    //constructor(private readonly databaseService: DatabaseService) {}
    
}
