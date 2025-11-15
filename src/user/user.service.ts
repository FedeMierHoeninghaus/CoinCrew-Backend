import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserTransactionDto } from './DTOs/user-transaction.dto';
import { FundService } from 'src/fund/fund.service';
@Injectable()
export class UserService {
    constructor(private readonly databaseService: DatabaseService, private readonly fundService: FundService) {}


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
        const client = await this.databaseService.getClient();
        try {
          await client.query('BEGIN');
          const {rows: userRows} = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
          if(userRows.length === 0){
            throw new NotFoundException('Usuario no encontrado');
          }
          const user = userRows[0];
        
          // 1) insert en user_transactions → devuelve userTx
          const { rows: txRows } = await client.query(
            `INSERT INTO public.user_transactions
               (user_id, currency, tx_type, amount, tx_date, description)
             VALUES ($1,$2,$3,$4,COALESCE($5,CURRENT_DATE),$6)
             RETURNING *;`,
            [user.id, userTransactionDto.currency, userTransactionDto.type, userTransactionDto.amount, userTransactionDto.date ?? null, userTransactionDto.description ?? null]
          );
          const userTx = txRows[0];
        
          // 2) buscar fundId por moneda
          const { rows: fundRows } = await client.query(
            `SELECT id FROM public.fund_accounts WHERE currency = $1 LIMIT 1;`,
            [userTransactionDto.currency],
          );
          if(fundRows.length === 0){
            throw new NotFoundException('Fondo no encontrado');
          }
          const fund = fundRows[0];
        
          // 3) asiento en caja (reutiliza la función de arriba)
          await this.fundService.postFundMovement(client, {
            fundId: fund.id,
            userTxType: userTransactionDto.type,
            amount: Number(userTransactionDto.amount),
            date: userTransactionDto.date,
            description: userTransactionDto.description ?? `Transacción de ${userTransactionDto.type} de ${user.name}`,
            relatedUserTxId: userTx.id,
            relatedCheckId: null,
          });
        
          await client.query('COMMIT');
          return userTx;
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
    }
}
