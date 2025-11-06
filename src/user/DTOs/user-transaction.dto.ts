export interface UserTransactionDto {
    currency: 'UYU' | 'USD';
    type: 'CONTRIBUTION' | 'WITHDRAWAL';
    amount: string;
    date: string;
    description: string;
}