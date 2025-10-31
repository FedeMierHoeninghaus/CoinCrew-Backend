import { Pool, QueryResult } from "pg";
export declare class DatabaseService {
    private readonly pool;
    constructor(pool: Pool);
    query(text: string, params?: any[]): Promise<QueryResult>;
    getClient(): Promise<import("pg").PoolClient>;
}
