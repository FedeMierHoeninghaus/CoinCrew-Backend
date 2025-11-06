import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserTransactionDto } from './DTOs/user-transaction.dto';
@Injectable()
export class UserService {
    constructor(private readonly databaseService: DatabaseService) {}


    //-----------validacuib del user-----------------------
    async validateUser(email: string, password: string){
        const {rows, rowCount} = await this.databaseService.query('Select * from users where email = $1 and password = $2', [email, password]);
        if(rowCount === 0){
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        const user = rows[0];
        const {password: _, ...safeUser} = user;
        return safeUser;
    }



    async getUserById(userId: string){
        const {rows, rowCount} = await this.databaseService.query('select * from users where id = $1', [userId]);
        if(rowCount === 0){
            throw new NotFoundException('Usuario no encontrado');
        }
        const user = rows[0];
        const {password: _, ...safeUser} = user;
        return safeUser;
    }

    async createTransaction(userId: string, userTransactionDto: UserTransactionDto){
        console.log("llegamos a createTransaction", {userId, userTransactionDto});
        const user = await this.getUserById(userId);
        const {rows, rowCount} = await this.databaseService.query(`insert into user_transactions (
            user_id,
            currency,
            tx_type,
            amount,
            tx_date,
            description
            )
            values ($1, $2, $3, $4, $5, $6) returning *`,
             [user.id,
                userTransactionDto.currency,
                userTransactionDto.type,
                userTransactionDto.amount, 
                userTransactionDto.date, 
                userTransactionDto.description,
             ]);

        if(rowCount === 0){
            throw new NotFoundException('Transacción no creada');
        }
        return rows[0];
    }
/*
        const fund = await this.databaseService.query(`select id from fund_accounts where currency = $1`, [userTransactionDto.currency]);
        if(fund.rowCount === 0){
            throw new NotFoundException('Fondo no encontrado');
        }
        const fundId = fund.rows[0].id;
        const movementType = userTransactionDto.transaction_type === 'CONTRIBUTION' ? 'WITHDRAWAL' : 'CONTRIBUTION';
        const signedAmount = userTransactionDto.transaction_type === 'CONTRIBUTION' ? userTransactionDto.amount : -userTransactionDto.amount;
        const insertMovement = await this.databaseService.query(`insert into cash_move (
            fund_id,
            movement_date,
            movement_type,
            amount,
            description
            )
            values ($1, $2, $3, $4, $5)`,
            [fundId,
                new Date(),
                movementType,
                signedAmount,
                userTransactionDto.description,
            ]);
        if(insertMovement.rowCount === 0){
            throw new NotFoundException('Movimiento no creado');
        }

        return console.log("movimiento creado correctamente");*/
    

    async getUserTransactions(userId: string){
        const user = await this.getUserById(userId);
        const {rows, rowCount} = await this.databaseService.query('select * from user_transactions where user_id = $1', [user.id]);
        if(rowCount === 0){
            throw new NotFoundException('Transacciones no encontradas para el usuario');
        }
        console.log("rows", rows);
        return rows;
    }
}
