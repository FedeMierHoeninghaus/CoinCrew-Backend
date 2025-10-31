import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundService } from './fund.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';

@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

  @Post()
  create(@Body() createFundDto: CreateFundDto) {
    return this.fundService.create(createFundDto);
  }

  @Get()
  findAll() {
    return this.fundService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFundDto: UpdateFundDto) {
    return this.fundService.update(+id, updateFundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundService.remove(+id);
  }
}
