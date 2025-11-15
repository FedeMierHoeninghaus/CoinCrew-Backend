import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundService } from './fund.service';


@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

 @Get('getFunds')
 async getFunds(){
  console.log('getFunds');
  return this.fundService.getFunds();
 }
}
