import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundService } from './fund.service';


@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

 @Get('getFunds')
 async getFunds(){
  return this.fundService.getFunds();
 }

 @Get('getProfits')
 async getProfits(){
  console.log('getProfits');
  return this.fundService.getProfits();
 }
}
