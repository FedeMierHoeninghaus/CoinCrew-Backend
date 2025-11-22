export declare class CreateTransactionForUserDto {
    userId: string;
    currency: 'UYU' | 'USD';
    type: 'CONTRIBUTION' | 'WITHDRAWAL';
    amount: number;
    date?: string;
    description?: string;
}
