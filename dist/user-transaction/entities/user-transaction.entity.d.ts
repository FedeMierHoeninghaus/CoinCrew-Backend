export declare class UserTransaction {
}
export declare enum UserTransactionType {
    CONTRIBTION = "CONTRIBUTION",
    WITHDRAWAL = "WITHDRAWAL"
}
export declare enum currency {
    UYU = "UYU",
    USD = "USD"
}
export declare class UserTransactionEntity {
    id: string;
    user: User;
    currency: currency;
    transaction_type: UserTransactionType;
    amount: string;
    tx_date: string;
    description: string;
    created_at: Date;
}
