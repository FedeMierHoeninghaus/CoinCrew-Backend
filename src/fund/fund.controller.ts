import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundService } from './fund.service';


@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

 
}
