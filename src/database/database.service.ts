import { Inject, Injectable } from "@nestjs/common";
import { Pool, QueryResult } from "pg";

@Injectable()
export class DatabaseService {
    constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

    async query(text: string, params?: any[]): Promise<QueryResult>{
        const start = Date.now()
        try {
            const res = await this.pool.query(text, params)
            const duration = Date.now() - start;
            console.log('Executed query', {text, duration, rows: res.rowCount})
            return res
        } catch (error) {
            console.error('Database query error:', {
                error: error.message,
                code: error.code,
                query: text.substring(0, 100),
                params: params ? params.length : 0
            });
            throw error;
        }
    }

    async getClient() {
        return this.pool.connect();
        
    }
}