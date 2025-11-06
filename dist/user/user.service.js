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
let UserService = class UserService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async validateUser(email, password) {
        const { rows, rowCount } = await this.databaseService.query('Select * from users where email = $1 and password = $2', [email, password]);
        if (rowCount === 0) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const user = rows[0];
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
        console.log("llegamos a createTransaction", { userId, userTransactionDto });
        const user = await this.getUserById(userId);
        const { rows, rowCount } = await this.databaseService.query(`insert into user_transactions (
            user_id,
            currency,
            tx_type,
            amount,
            tx_date,
            description
            )
            values ($1, $2, $3, $4, $5, $6) returning *`, [user.id,
            userTransactionDto.currency,
            userTransactionDto.type,
            userTransactionDto.amount,
            userTransactionDto.date,
            userTransactionDto.description,
        ]);
        if (rowCount === 0) {
            throw new common_1.NotFoundException('Transacción no creada');
        }
        return rows[0];
    }
    async getUserTransactions(userId) {
        const user = await this.getUserById(userId);
        const { rows, rowCount } = await this.databaseService.query('select * from user_transactions where user_id = $1', [user.id]);
        if (rowCount === 0) {
            throw new common_1.NotFoundException('Transacciones no encontradas para el usuario');
        }
        console.log("rows", rows);
        return rows;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UserService);
//# sourceMappingURL=user.service.js.map