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
exports.ChecksService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let ChecksService = class ChecksService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(createCheckDto) {
        console.log('llegamos a create service');
        console.log('createCheckDto', createCheckDto);
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const insertCheckQuery = `
        INSERT INTO public.checks (
          currency,
          purchase_date,
          maturity_date,
          face_value,
          purchase_price,
          transfer_fee,
          platform_fee,
          status,
          payer
        )
        VALUES ($1,$2,$3,$4,$5, COALESCE($6,0), COALESCE($7,0), 'COMPRADO', $8)   
        RETURNING *;
        `;
            const { rows: check } = await client.query(insertCheckQuery, [
                createCheckDto.currency,
                createCheckDto.purchase_date,
                createCheckDto.maturity_date,
                createCheckDto.face_value,
                createCheckDto.purchase_price,
                createCheckDto.transfer_fee ?? 0,
                createCheckDto.platform_fee ?? 0,
                createCheckDto.issuer,
            ]);
            if (check.length === 0) {
                throw new common_1.NotFoundException('Cheque no creado');
            }
            const { rows: fundAccounts } = await client.query(`SELECT * FROM fund_accounts WHERE currency = $1`, [createCheckDto.currency]);
            if (fundAccounts.length === 0) {
                throw new common_1.NotFoundException('Fondo no encontrado');
            }
            const fundId = fundAccounts[0].id;
            await client.query(`insert into cash_movements (fund_id, movement_date, type, description, amount, related_check)
          values ($1, $2::date, 'COMPRA_CHEQUE', $3, $4, $5)`, [fundId, createCheckDto.purchase_date, 'COMPRA_CHEQUE', -createCheckDto.purchase_price, check[0].id]);
            if (Number(check[0].platform_fee) > 0) {
                await client.query(`insert into cash_movements (fund_id, movement_date, type, description, amount, related_check)
            values ($1, $2::date, 'COMISION_MIFINANZAS', $3, $4, $5)`, [fundId, createCheckDto.purchase_date, 'COMISION_PLATAFORMA', -Number(check[0].platform_fee), check[0].id]);
            }
            if (Number(check[0].transfer_fee) > 0) {
                await client.query(`insert into cash_movements (fund_id, movement_date, type, description, amount, related_check)
            values ($1, $2::date, 'COMISION_BANCARIA', $3, $4, $5)`, [fundId, createCheckDto.purchase_date, 'COMISION_TRANSFERENCIA', -Number(check[0].transfer_fee), check[0].id]);
            }
            const { rows: balance } = await client.query(`WITH balances AS (
          SELECT
            u.id AS user_id,
            COALESCE(SUM(
              CASE
                WHEN ut.tx_type = 'CONTRIBUTION' THEN ut.amount
                WHEN ut.tx_type = 'WITHDRAWAL'   THEN -ut.amount
                ELSE 0
              END
            ), 0) AS balance
          FROM public.users u
          LEFT JOIN public.user_transactions ut
            ON ut.user_id = u.id
           AND ut.currency = $1
           AND ut.tx_date <= $2::date
          GROUP BY u.id
        )
        SELECT user_id, balance
        FROM balances
        WHERE balance > 0;`, [check[0].currency, check[0].purchase_date]);
            const total = balance.reduce((acc, curr) => acc + curr.balance, 0);
            if (total <= 0) {
                throw new common_1.NotFoundException('No hay fondos disponibles');
            }
            for (const b of balance) {
                const userBalance = Number(b.balance);
                const share = Number((userBalance / total).toFixed(10));
                await client.query(`INSERT INTO public.check_participations
               (check_id, user_id, share, basis_user_balance, basis_total_balance)
             VALUES
               ($1, $2, $3, $4, $5);`, [
                    check[0].id,
                    b.user_id,
                    share,
                    userBalance,
                    total,
                ]);
            }
            await client.query('COMMIT');
            return check[0];
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async findAll() {
        const client = await this.databaseService.getClient();
        try {
            const { rows: checks } = await client.query(`SELECT * FROM public.checks`);
            console.log('checks', checks);
            return checks;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    findOne(id) {
        return `This action returns a #${id} check`;
    }
    update(id, updateCheckDto) {
        return `This action updates a #${id} check`;
    }
    remove(id) {
        return `This action removes a #${id} check`;
    }
};
exports.ChecksService = ChecksService;
exports.ChecksService = ChecksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ChecksService);
//# sourceMappingURL=checks.service.js.map