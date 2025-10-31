import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { ChecksModule } from './checks/checks.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        DatabaseModule,
        ReceiptsModule,
        ChecksModule,
        AuthModule,
        UserModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
