import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';

@Controller('checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @Post()
  create(@Body() createCheckDto: CreateCheckDto) {
console.log('createCheckDto', createCheckDto);
    return this.checksService.create(createCheckDto);
  }

  @Get()
  findAll() {
    return this.checksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id', id);
    return this.checksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto) {
    console.log('updateCheckDto', updateCheckDto);
    return this.checksService.update(id, updateCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checksService.remove(+id);
  }

  @Get('getMovements/:id')
  getMovements(@Param('id') id: string) {
    console.log('getMovements controller');
    console.log('id', id);
    return this.checksService.getMovements(id);
  }
}
