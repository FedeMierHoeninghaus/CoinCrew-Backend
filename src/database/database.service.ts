import { Inject, Injectable } from "@nestjs/common";
import { Pool, QueryResult } from "pg";

@Injectable()
export class DatabaseService {
    constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

    async query(text: string, params?: any[]): Promise<QueryResult>{
        const start = Date.now()
        const res = await this.pool.query(text, params)
        const duration = Date.now() - start;
        console.log('Executed query', {text, duration, rows: res.rowCount})
        return res
    }

    async getClient() {
        return this.pool.connect();
        
    }
}