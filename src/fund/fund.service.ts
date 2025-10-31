import { Injectable } from '@nestjs/common';
import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';

@Injectable()
export class FundService {
  create(createFundDto: CreateFundDto) {
    return 'This action adds a new fund';
  }

  findAll() {
    return `This action returns all fund`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fund`;
  }

  update(id: number, updateFundDto: UpdateFundDto) {
    return `This action updates a #${id} fund`;
  }

  remove(id: number) {
    return `This action removes a #${id} fund`;
  }
}
