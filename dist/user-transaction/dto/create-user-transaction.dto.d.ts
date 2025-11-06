export declare class CreateUserTransactionDto {
    currency: 'UYU' | 'USD';
    transaction_type: 'CONTRIBUTION' | 'WITHDRAWAL';
    amount: string;
    tx_date: string;
    description: string;
}
