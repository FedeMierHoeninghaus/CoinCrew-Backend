import { DatabaseService } from 'src/database/database.service';
export declare class FundService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    postFundMovement(client: any, p: {
        fundId: number;
        userTxType: 'CONTRIBUTION' | 'WITHDRAWAL';
        amount: number;
        date?: string;
        description?: string | null;
        relatedUserTxId?: string | null;
        relatedCheckId?: string | null;
    }): Promise<any>;
    getFunds(): Promise<any[]>;
    getProfits(): Promise<any[]>;
}
