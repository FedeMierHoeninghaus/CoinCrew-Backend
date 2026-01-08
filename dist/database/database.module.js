"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
const database_service_1 = require("./database.service");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [{
                provide: 'DATABASE_POOL',
                useFactory: (configService) => {
                    const connectionString = configService.get('DATABASE_URL') || process.env.DATABASE_URL;
                    console.log('DATABASE_URL configured:', !!connectionString);
                    console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('DB_')));
                    if (connectionString) {
                        console.log('Using DATABASE_URL connection string');
                        const isSupabasePooler = connectionString.includes('pooler.supabase.com') ||
                            connectionString.includes('supabase.co');
                        const needsSSL = connectionString.includes('sslmode=require') ||
                            connectionString.includes('ssl=true') ||
                            isSupabasePooler;
                        console.log('Database connection config:', {
                            isSupabasePooler,
                            needsSSL,
                            host: connectionString.match(/@([^:]+)/)?.[1] || 'unknown',
                            port: connectionString.match(/:(\d+)\//)?.[1] || 'unknown'
                        });
                        const pool = new pg_1.Pool({
                            connectionString,
                            ssl: needsSSL ? { rejectUnauthorized: false } : false,
                            max: 10,
                            idleTimeoutMillis: 30000,
                            connectionTimeoutMillis: 10000,
                        });
                        pool.on('error', (err) => {
                            console.error('Unexpected error on idle client', err);
                        });
                        return pool;
                    }
                    const dbHost = configService.get('DB_HOST') || process.env.DB_HOST;
                    const dbPort = configService.get('DB_PORT') || process.env.DB_PORT;
                    const dbUser = configService.get('DB_USER') || process.env.DB_USER;
                    const dbPassword = configService.get('DB_PASSWORD') || process.env.DB_PASSWORD;
                    const dbName = configService.get('DB_NAME') || process.env.DB_NAME;
                    console.log('Using individual DB variables:', {
                        host: dbHost || 'localhost',
                        port: dbPort || 5432,
                        user: dbUser ? '***' : 'not set',
                        password: dbPassword ? '***' : 'not set',
                        database: dbName || 'not set'
                    });
                    if (!dbHost && !dbUser && !dbName && !connectionString) {
                        const errorMsg = 'ERROR: No database configuration found. Please set DATABASE_URL in Vercel Environment Variables.';
                        console.error(errorMsg);
                        throw new Error(errorMsg);
                    }
                    return new pg_1.Pool({
                        host: dbHost || 'localhost',
                        port: dbPort ? parseInt(dbPort) : 5432,
                        user: dbUser,
                        password: dbPassword,
                        database: dbName,
                    });
                },
                inject: [config_1.ConfigService],
            },
            database_service_1.DatabaseService],
        exports: ['DATABASE_POOL', database_service_1.DatabaseService],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map