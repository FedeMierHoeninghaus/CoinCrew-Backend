import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

@Global()
@Module({
    providers: [{
        provide: 'DATABASE_POOL',
        useFactory: (configService: ConfigService) => {
            // Primero intenta usar DATABASE_URL (para producción/Vercel)
            const connectionString = configService.get('DATABASE_URL');
            if (connectionString) {
                return new Pool({
                    connectionString,
                    ssl: connectionString.includes('sslmode=require') || connectionString.includes('ssl=true') 
                        ? { rejectUnauthorized: false }
                        : false,
                });
            }
            // Fallback a variables individuales (para desarrollo local)
            return new Pool({
                host: configService.get('DB_HOST') || 'localhost',
                port: configService.get('DB_PORT') || 5432,
                user: configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
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