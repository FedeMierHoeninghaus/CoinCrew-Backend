import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

@Global()
@Module({
    providers: [{
        provide: 'DATABASE_POOL',
        useFactory: (configService: ConfigService) => {
            // Primero intenta usar DATABASE_URL (para producción/Vercel con Supabase)
            const connectionString = configService.get('DATABASE_URL') || process.env.DATABASE_URL;
            console.log('DATABASE_URL configured:', !!connectionString);
            
            if (connectionString) {
                console.log('Using DATABASE_URL connection string for Supabase');
                // Para Supabase siempre usar SSL
                return new Pool({
                    connectionString,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                    // Configuración optimizada para serverless
                    max: 10,
                    idleTimeoutMillis: 30000,
                    connectionTimeoutMillis: 10000,
                });
            }
            
            // Fallback a variables individuales (para desarrollo local)
            const dbHost = configService.get('DB_HOST') || process.env.DB_HOST;
            const dbPort = configService.get('DB_PORT') || process.env.DB_PORT;
            const dbUser = configService.get('DB_USER') || process.env.DB_USER;
            const dbPassword = configService.get('DB_PASSWORD') || process.env.DB_PASSWORD;
            const dbName = configService.get('DB_NAME') || process.env.DB_NAME;
            
            console.log('Using individual DB variables for local development');
            
            if (!dbHost && !dbUser && !dbName) {
                const errorMsg = 'ERROR: No database configuration found. Please set DATABASE_URL in Vercel Environment Variables.';
                console.error(errorMsg);
                throw new Error(errorMsg);
            }
            
            return new Pool({
                host: dbHost || 'localhost',
                port: dbPort ? parseInt(dbPort) : 5432,
                user: dbUser,
                password: dbPassword,
                database: dbName,
            });
        },
        inject: [ConfigService],
    },
    DatabaseService],
    exports: ['DATABASE_POOL', DatabaseService],
})
export class DatabaseModule {}


/*local
 {
            provide: 'DATABASE_POOL',
            useFactory: (configService: ConfigService) => {return new Pool({
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                user: configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
            });},
            inject: [ConfigService],
        }

*/


/*supabase
{
            provide: 'DATABASE_POOL',
            useFactory: (configService: ConfigService) => {
                const connectionString = configService.get('DATABASE_URL');
                if(connectionString){
                    return new Pool({
                        connectionString,
                        ssl: {
                            rejectUnauthorized: false,
                        },
                    });
                }
                return null;
            }*/