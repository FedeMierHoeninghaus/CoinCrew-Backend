import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { ChecksModule } from './checks/checks.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AccountModule } from './account/account.module';

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
        TransactionsModule,
        AccountModule,
        
    ],
    controllers: [AppController],
})
export class AppModule {}
