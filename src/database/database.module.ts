import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

@Global()
@Module({
    providers: [
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
                        // Configuración para producción
                        max: 20,
                        idleTimeoutMillis: 30000,
                        connectionTimeoutMillis: 10000,
                        // Forzar IPv4
                        host: 'db.sarchgjfiabbhnuaktdr.supabase.co',
                        family: 4,
                    });
                }
                return null;
            },
            inject: [ConfigService],
        }, DatabaseService,
    ],
    exports: ['DATABASE_POOL', DatabaseService],
})
export class DatabaseModule {}


/*
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


/*{
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
}*/