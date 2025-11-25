"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const fund_service_1 = require("../fund/fund.service");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(databaseService, fundService) {
        this.databaseService = databaseService;
        this.fundService = fundService;
    }
    async createUser(first_name, last_name, email, password) {
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const { rows: existingUser } = await client.query('SELECT id FROM users WHERE email = $1', [email]);
            if (existingUser.length > 0) {
                throw new common_1.ConflictException('El email ya está registrado');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const { rows: newUser } = await client.query(`INSERT INTO users (first_name, last_name, email, password)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`, [first_name, last_name, email, hashedPassword]);
            await client.query('COMMIT');
            const user = newUser[0];
            const { password: _, ...safeUser } = user;
            return safeUser;
        }
        catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }
        finally {
            client.release();
        }
    }
    async validateUser(email, password) {
        const { rows, rowCount } = await this.databaseService.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rowCount === 0) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const { password: _, ...safeUser } = user;
        return safeUser;
    }
    async getUserById(userId) {
        const { rows, rowCount } = await this.databaseService.query('select * from users where id = $1', [userId]);
        if (rowCount === 0) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const user = rows[0];
        const { password: _, ...safeUser } = user;
        return safeUser;
    }
    async createTransaction(userId, userTransactionDto) {
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const { rows: userRows } = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
            if (userRows.length === 0) {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            const user = userRows[0];
            const { rows: txRows } = await client.query(`INSERT INTO public.user_transactions
               (user_id, currency, tx_type, amount, tx_date, description)
             VALUES ($1,$2,$3,$4,COALESCE($5,CURRENT_DATE),$6)
             RETURNING *;`, [user.id, userTransactionDto.currency, userTransactionDto.type, userTransactionDto.amount, userTransactionDto.date ?? null, userTransactionDto.description ?? null]);
            const userTx = txRows[0];
            const { rows: fundRows } = await client.query(`SELECT id FROM public.fund_accounts WHERE currency = $1 LIMIT 1;`, [userTransactionDto.currency]);
            if (fundRows.length === 0) {
                throw new common_1.NotFoundException('Fondo no encontrado');
            }
            const fund = fundRows[0];
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
        }
        catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }
        finally {
            client.release();
        }
    }
    async getUserTransactions(userId) {
        const { rows, rowCount } = await this.databaseService.query('select * from user_transactions where user_id = $1', [userId]);
        if (rowCount === 0) {
            throw new common_1.NotFoundException('Transacciones no encontradas');
        }
        return rows;
    }
    async findAll() {
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const { rows: users } = await client.query('select * from users');
            const safeUsers = users.map(user => {
                const { password: _, ...safeUser } = user;
                return safeUser;
            });
            await client.query('COMMIT');
            return safeUsers;
        }
        catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }
        finally {
            client.release();
        }
    }
    async createTransactionForUser(createTransactionDto) {
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const { rows: userRows } = await client.query('SELECT * FROM users WHERE id = $1', [createTransactionDto.userId]);
            if (userRows.length === 0) {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            const user = userRows[0];
            const { rows: txRows } = await client.query(`INSERT INTO public.user_transactions
             (user_id, currency, tx_type, amount, tx_date, description)
           VALUES ($1,$2,$3,$4,COALESCE($5,CURRENT_DATE),$6)
           RETURNING *;`, [
                user.id,
                createTransactionDto.currency,
                createTransactionDto.type,
                createTransactionDto.amount,
                createTransactionDto.date ?? null,
                createTransactionDto.description ?? null
            ]);
            const userTx = txRows[0];
            const { rows: fundRows } = await client.query(`SELECT id FROM public.fund_accounts WHERE currency = $1 LIMIT 1;`, [createTransactionDto.currency]);
            if (fundRows.length === 0) {
                throw new common_1.NotFoundException('Fondo no encontrado');
            }
            const fund = fundRows[0];
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
        }
        catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }
        finally {
            client.release();
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService, fund_service_1.FundService])
], UserService);
//# sourceMappingURL=user.service.js.map