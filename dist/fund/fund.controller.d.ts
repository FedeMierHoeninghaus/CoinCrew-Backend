import { FundService } from './fund.service';
export declare class FundController {
    private readonly fundService;
    constructor(fundService: FundService);
    getFunds(): Promise<any[]>;
}
