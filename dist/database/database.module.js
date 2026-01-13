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
                    const connectionString = process.env.DATABASE_URL || configService.get('DATABASE_URL');
                    console.log('=== DATABASE CONFIGURATION ===');
                    console.log('DATABASE_URL from process.env:', !!process.env.DATABASE_URL);
                    console.log('DATABASE_URL from configService:', !!configService.get('DATABASE_URL'));
                    console.log('Final DATABASE_URL:', !!connectionString);
                    if (connectionString) {
                        console.log('DATABASE_URL host:', connectionString.match(/@([^:]+)/)?.[1] || 'unknown');
                    }
                    if (connectionString) {
                        console.log('✅ Using DATABASE_URL connection string for Supabase');
                        return new pg_1.Pool({
                            connectionString,
                            ssl: {
                                rejectUnauthorized: false,
                            },
                            max: 10,
                            idleTimeoutMillis: 30000,
                            connectionTimeoutMillis: 10000,
                        });
                    }
                    const dbHost = process.env.DB_HOST || configService.get('DB_HOST');
                    const dbPort = process.env.DB_PORT || configService.get('DB_PORT');
                    const dbUser = process.env.DB_USER || configService.get('DB_USER');
                    const dbPassword = process.env.DB_PASSWORD || configService.get('DB_PASSWORD');
                    const dbName = process.env.DB_NAME || configService.get('DB_NAME');
                    if (process.env.VERCEL && !connectionString) {
                        const errorMsg = 'ERROR: DATABASE_URL is required in Vercel Environment Variables but was not found. Please configure it in Vercel Dashboard → Settings → Environment Variables.';
                        console.error(errorMsg);
                        throw new Error(errorMsg);
                    }
                    if (!dbHost && !dbUser && !dbName) {
                        const errorMsg = 'ERROR: No database configuration found. Please set DATABASE_URL or individual DB variables.';
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