import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

@Global()
@Module({
    providers: [{
        provide: 'DATABASE_POOL',
        useFactory: (configService: ConfigService) => {
            // Leer DATABASE_URL directamente de process.env primero (para Vercel)
            // Luego intentar desde ConfigService (para desarrollo local con .env)
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
            const dbHost = process.env.DB_HOST || configService.get('DB_HOST');
            const dbPort = process.env.DB_PORT || configService.get('DB_PORT');
            const dbUser = process.env.DB_USER || configService.get('DB_USER');
            const dbPassword = process.env.DB_PASSWORD || configService.get('DB_PASSWORD');
            const dbName = process.env.DB_NAME || configService.get('DB_NAME');
            
            console.log('⚠️ Using individual DB variables for local development');
            console.log('DB_HOST:', dbHost || 'not set');
            console.log('DB_PORT:', dbPort || 'not set');
            console.log('DB_USER:', dbUser ? '***' : 'not set');
            console.log('DB_NAME:', dbName || 'not set');
            
            // En producción (Vercel), si no hay DATABASE_URL, lanzar error
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