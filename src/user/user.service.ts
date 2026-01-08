import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserTransactionDto } from './DTOs/user-transaction.dto';
import { FundService } from 'src/fund/fund.service';
import { CreateTransactionForUserDto } from './DTOs/create-transaction-for-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(private readonly databaseService: DatabaseService, private readonly fundService: FundService) {}


    //-----------crear usuario----------------------- 
    async createUser(first_name: string, last_name: string, email: string, password: string){
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            
            // Verificar si el email ya existe
            const {rows: existingUser} = await client.query(
                'SELECT id FROM users WHERE email = $1',
                [email]
            );
            
            if(existingUser.length > 0){
                throw new ConflictException('El email ya está registrado');
            }
            
            // Crear el usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const {rows: newUser} = await client.query(
                `INSERT INTO users (first_name, last_name, email, password)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [first_name, last_name, email, hashedPassword]
            );
            
            await client.query('COMMIT');
            
            const user = newUser[0];
            const {password: _, ...safeUser} = user;
            return safeUser;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    //-----------validacuib del user-----------------------
    async validateUser(email: string, password: string){
        try {
            console.log('Validating user:', email);
            const {rows, rowCount} = await this.databaseService.query('SELECT * FROM users WHERE email = $1', [email]);
            console.log('Query result:', { rowCount, hasRows: rows.length > 0 });
            
            if(rowCount === 0){
                console.log('User not found:', email);
                throw new UnauthorizedException('Credenciales incorrectas');
            }
            const user = rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Password valid:', isPasswordValid);
            
            if(!isPasswordValid){
                throw new UnauthorizedException('Credenciales incorrectas');
            }
            const {password: _, ...safeUser} = user;
            return safeUser;
        } catch (error) {
            console.error('Error in validateUser:', error);
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Error al validar usuario: ' + error.message);
        }
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

    async getUserTransactions(userId: string){
        const {rows, rowCount} = await this.databaseService.query('select * from user_transactions where user_id = $1', [userId]);
        if(rowCount === 0){
            throw new NotFoundException('Transacciones no encontradas');
        }
        return rows;
    }

    async findAll(){
      const client = await this.databaseService.getClient();
      try {
        await client.query('BEGIN');
        const {rows: users} = await client.query('select * from users');
        const safeUsers = users.map(user => {
          const {password: _, ...safeUser} = user;
          return safeUser;
        });
        await client.query('COMMIT');
        return safeUsers;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    }

    async createTransactionForUser(createTransactionDto: CreateTransactionForUserDto){
      const client = await this.databaseService.getClient();
      try {
        await client.query('BEGIN');
        
        // Verificar que el usuario existe
        const {rows: userRows} = await client.query('SELECT * FROM users WHERE id = $1', [createTransactionDto.userId]);
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
          [
            user.id, 
            createTransactionDto.currency, 
            createTransactionDto.type, 
            createTransactionDto.amount, 
            createTransactionDto.date ?? null, 
            createTransactionDto.description ?? null
          ]
        );
        const userTx = txRows[0];
      
        // 2) buscar fundId por moneda
        const { rows: fundRows } = await client.query(
          `SELECT id FROM public.fund_accounts WHERE currency = $1 LIMIT 1;`,
          [createTransactionDto.currency],
        );
        if(fundRows.length === 0){
          throw new NotFoundException('Fondo no encontrado');
        }
        const fund = fundRows[0];
      
        // 3) asiento en caja (reutiliza la función de arriba)
        await this.fundService.postFundMovement(client, {
          fundId: fund.id,
          userTxType: createTransactionDto.type,
          amount: Number(createTransactionDto.amount),
          date: createTransactionDto.date,
          description: createTransactionDto.description ?? `Transacción de ${createTransactionDto.type} de ${user.name}`,
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
