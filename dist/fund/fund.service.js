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
exports.FundService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let FundService = class FundService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async postFundMovement(client, p) {
        const movementType = p.userTxType === 'CONTRIBUTION' ? 'APORTE' : 'AJUSTE';
        const signedAmount = p.userTxType === 'CONTRIBUTION' ? p.amount : -p.amount;
        const sql = `
      INSERT INTO public.cash_movements
        (fund_id, movement_date, type, description, amount, related_check, related_user_tx)
      VALUES
        ($1, COALESCE($2, CURRENT_DATE), $3, $4, $5, $6, $7)
      RETURNING *;`;
        const vals = [
            p.fundId,
            p.date ?? null,
            movementType,
            p.description ?? `Movimiento de fondo de ${p.userTxType}`,
            signedAmount,
            p.relatedCheckId ?? null,
            p.relatedUserTxId ?? null,
        ];
        const { rows } = await client.query(sql, vals);
        return rows[0];
    }
    async getFunds() {
        console.log('getFunds');
        const { rows } = await this.databaseService.query('SELECT * FROM public.v_fund_balance');
        console.log('rows', rows);
        return rows;
    }
};
exports.FundService = FundService;
exports.FundService = FundService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], FundService);
//# sourceMappingURL=fund.service.js.map