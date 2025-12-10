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
const check_status_1 = require("../common/enums/check-status");
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
        VALUES ($1::currency, $2::date, $3::date, $4::numeric, $5::numeric, COALESCE($6::numeric,0), COALESCE($7::numeric,0), 'COMPRADO'::check_status, $8::text)   
        RETURNING *;
        `;
            if (!['UYU', 'USD'].includes(createCheckDto.currency)) {
                throw new Error(`Currency inválida: ${createCheckDto.currency}. Debe ser UYU o USD`);
            }
            const faceValue = Number(createCheckDto.face_value);
            const purchasePrice = Number(createCheckDto.purchase_price);
            if (faceValue < purchasePrice) {
                throw new common_1.BadRequestException(`El valor del cheque (${faceValue}) debe ser mayor o igual al precio de compra (${purchasePrice})`);
            }
            console.log('CreateCheckDto values:', {
                currency: createCheckDto.currency,
                purchase_date: createCheckDto.purchase_date,
                maturity_date: createCheckDto.maturity_date,
                face_value: createCheckDto.face_value,
                purchase_price: createCheckDto.purchase_price,
                transfer_fee: createCheckDto.transfer_fee,
                platform_fee: createCheckDto.platform_fee,
                issuer: createCheckDto.issuer,
            });
            const queryParams = [
                createCheckDto.currency,
                createCheckDto.purchase_date,
                createCheckDto.maturity_date,
                Number(createCheckDto.face_value),
                Number(createCheckDto.purchase_price),
                Number(createCheckDto.transfer_fee ?? 0),
                Number(createCheckDto.platform_fee ?? 0),
                createCheckDto.issuer || null,
            ];
            console.log('Query parameters:', queryParams);
            const { rows: check } = await client.query(insertCheckQuery, queryParams);
            if (check.length === 0) {
                throw new common_1.NotFoundException('Cheque no creado');
            }
            const { rows: fundAccounts } = await client.query(`SELECT * FROM fund_accounts WHERE currency = $1`, [createCheckDto.currency]);
            if (fundAccounts.length === 0) {
                throw new common_1.NotFoundException('Fondo no encontrado');
            }
            const fundId = fundAccounts[0].id;
            await client.query(`insert into cash_movements (fund_id, movement_date, type, description, amount, related_check)
          values ($1::integer, $2::date, 'COMPRA_CHEQUE', $3, $4::numeric, $5::uuid)`, [parseInt(fundId), createCheckDto.purchase_date, 'COMPRA_CHEQUE', -Number(createCheckDto.purchase_price), check[0].id]);
            if (Number(check[0].platform_fee) > 0) {
                await client.query(`insert into cash_movements (fund_id, movement_date, type, description, amount, related_check)
            values ($1::integer, $2::date, 'COMISION_MIFINANZAS', $3, $4::numeric, $5::uuid)`, [parseInt(fundId), createCheckDto.purchase_date, 'COMISION_PLATAFORMA', -Number(check[0].platform_fee), check[0].id]);
            }
            if (Number(check[0].transfer_fee) > 0) {
                await client.query(`insert into cash_movements (fund_id, movement_date, type, description, amount, related_check)
            values ($1::integer, $2::date, 'COMISION_BANCARIA', $3, $4::numeric, $5::uuid)`, [parseInt(fundId), createCheckDto.purchase_date, 'COMISION_TRANSFERENCIA', -Number(check[0].transfer_fee), check[0].id]);
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
            const total = balance.reduce((acc, curr) => acc + Number(curr.balance), 0);
            if (total <= 0) {
                throw new common_1.NotFoundException('No hay fondos disponibles');
            }
            for (const b of balance) {
                const userBalance = Number(b.balance);
                const share = Number((userBalance / total).toFixed(10));
                await client.query(`INSERT INTO public.check_participations
               (check_id, user_id, share, basis_user_balance, basis_total_balance)
             VALUES
               ($1::uuid, $2::uuid, $3::numeric, $4::numeric, $5::numeric);`, [
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
        console.log('findAll service');
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
    async findOne(id) {
        console.log("entramos a findOne service");
        const client = await this.databaseService.getClient();
        try {
            const { rows: check } = await client.query(`SELECT * FROM public.checks WHERE id = $1`, [id]);
            console.log('check', check);
            return check[0];
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    async update(id, updateCheckDto) {
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const { rows: existingCheck } = await client.query(`SELECT * FROM public.checks WHERE id = $1`, [id]);
            if (existingCheck.length === 0) {
                throw new common_1.NotFoundException('Cheque no encontrado');
            }
            const check = existingCheck[0];
            const previousStatus = check.status;
            if (check.status === check_status_1.CheckStatus.COBRADO) {
                throw new common_1.BadRequestException('El cheque ya esta en estado COBRADO');
            }
            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;
            if (updateCheckDto.status !== undefined) {
                updateFields.push(`status = $${paramIndex++}`);
                updateValues.push(updateCheckDto.status);
            }
            if (updateCheckDto.maturity_date !== undefined) {
                updateFields.push(`maturity_date = $${paramIndex++}`);
                updateValues.push(updateCheckDto.maturity_date);
            }
            if (updateCheckDto.platform_fee !== undefined) {
                updateFields.push(`platform_fee = $${paramIndex++}`);
                updateValues.push(updateCheckDto.platform_fee);
            }
            if (updateCheckDto.transfer_fee !== undefined) {
                updateFields.push(`transfer_fee = $${paramIndex++}`);
                updateValues.push(updateCheckDto.transfer_fee);
            }
            if (updateCheckDto.settled_date !== undefined) {
                updateFields.push(`settled_date = $${paramIndex++}`);
                updateValues.push(updateCheckDto.settled_date);
            }
            if (updateFields.length === 0) {
                await client.query('COMMIT');
                return check;
            }
            updateValues.push(id);
            const updateQuery = `
        UPDATE public.checks
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramIndex}
        RETURNING *;
      `;
            const { rows: updatedCheck } = await client.query(updateQuery, updateValues);
            if (updateCheckDto.status === check_status_1.CheckStatus.RECHAZADO) {
                await client.query(`UPDATE public.checks
           SET status = 'RECHAZADO' WHERE id = $1`, [id]);
                await client.query(`update cash_movements
           set description = 'CHEQUE RECHAZADO',
            amount = 0 where related_check = $1`, [id]);
            }
            if (updateCheckDto.status === 'RECUPERADO') {
                if (!updateCheckDto.recovered_amount || updateCheckDto.recovered_amount <= 0) {
                    throw new Error('El monto recuperado debe ser mayor a 0');
                }
                const { rows: previousRecoveries } = await client.query(`SELECT COALESCE(SUM(recovered_amount), 0) as total_recovered FROM public.check_recoveries WHERE check_id = $1`, [id]);
                const totalPreviouslyRecovered = Number(previousRecoveries[0]?.total_recovered || 0);
                const newRecoveryAmount = Number(updateCheckDto.recovered_amount);
                const totalAfterRecovery = totalPreviouslyRecovered + newRecoveryAmount;
                if (totalAfterRecovery > Number(check.face_value)) {
                    throw new Error(`El total de recuperaciones (${totalAfterRecovery}) no puede exceder el valor nominal del cheque (${check.face_value})`);
                }
                await client.query(`INSERT INTO public.check_recoveries (check_id, recovery_date, recovered_amount, description)
           VALUES ($1, $2::date, $3, $4)`, [
                    id,
                    updateCheckDto.settled_date || new Date().toISOString().split('T')[0],
                    newRecoveryAmount,
                    `Recuperación parcial - Monto: ${newRecoveryAmount}`
                ]);
                let newStatus;
                if (totalAfterRecovery >= Number(check.face_value)) {
                    newStatus = 'RECUPERADO_COMPLETO';
                }
                else {
                    newStatus = 'RECUPERADO_PARCIAL';
                }
                await client.query(`UPDATE public.checks SET status = $1 WHERE id = $2`, [newStatus, id]);
                const { rows: fundAccounts } = await client.query(`SELECT * FROM fund_accounts WHERE currency = $1`, [check.currency]);
                if (fundAccounts.length === 0) {
                    throw new common_1.NotFoundException('Fondo no encontrado');
                }
                const fundId = fundAccounts[0].id;
                await client.query(`INSERT INTO cash_movements (fund_id, movement_date, type, description, amount, related_check)
           VALUES ($1, $2::date, 'RECUPERACION_CHEQUE', $3, $4, $5)`, [
                    fundId,
                    updateCheckDto.settled_date || new Date().toISOString().split('T')[0],
                    `Recuperación ${newStatus === 'RECUPERADO_COMPLETO' ? 'completa' : 'parcial'} de cheque`,
                    newRecoveryAmount,
                    id
                ]);
                if (newStatus === 'RECUPERADO_COMPLETO') {
                    await this.handleCompleteRecoveryProfitDistribution(client, id, check, totalAfterRecovery, updateCheckDto.settled_date);
                }
            }
            if (updateCheckDto.status === check_status_1.CheckStatus.COBRADO && previousStatus !== check_status_1.CheckStatus.COBRADO) {
                if (!updateCheckDto.settled_date) {
                    throw new Error('La fecha de cobro (settled_date) es requerida cuando el estado es COBRADO');
                }
                const { rows: fundAccounts } = await client.query(`SELECT * FROM fund_accounts WHERE currency = $1`, [check.currency]);
                if (fundAccounts.length === 0) {
                    throw new common_1.NotFoundException('Fondo no encontrado');
                }
                const fundId = fundAccounts[0].id;
                await client.query(`INSERT INTO cash_movements (fund_id, movement_date, type, description, amount, related_check)
           VALUES ($1, $2::date, 'COBRO_CHEQUE', 'Cobro de cheque', $3, $4)`, [fundId, updateCheckDto.settled_date, check.face_value, id]);
                const finalCheck = updatedCheck[0] || check;
                const transferFee = updateCheckDto.transfer_fee !== undefined
                    ? updateCheckDto.transfer_fee
                    : Number(finalCheck.transfer_fee || 0);
                const platformFee = updateCheckDto.platform_fee !== undefined
                    ? updateCheckDto.platform_fee
                    : Number(finalCheck.platform_fee || 0);
                const profit = Number(finalCheck.face_value)
                    - Number(finalCheck.purchase_price)
                    - transferFee
                    - platformFee;
                const { rows: participations } = await client.query(`SELECT user_id, share FROM public.check_participations WHERE check_id = $1`, [id]);
                if (participations.length === 0) {
                    throw new common_1.NotFoundException('No se encontraron participaciones para este cheque');
                }
                const allocationDate = updateCheckDto.settled_date || new Date().toISOString().split('T')[0];
                for (const participation of participations) {
                    const userShare = Number(participation.share);
                    const allocationAmount = Number((profit * userShare).toFixed(2));
                    await client.query(`INSERT INTO public.profit_allocations 
             (check_id, user_id, currency, allocation_amount, allocation_date)
             VALUES ($1, $2, $3, $4, $5::date)`, [
                        id,
                        participation.user_id,
                        finalCheck.currency,
                        allocationAmount,
                        allocationDate
                    ]);
                    await client.query(`INSERT INTO public.user_transactions
             (user_id, currency, tx_type, amount, tx_date, description)
             VALUES ($1, $2, 'CONTRIBUTION', $3, $4::date, $5)`, [
                        participation.user_id,
                        finalCheck.currency,
                        allocationAmount,
                        allocationDate,
                        `Ganancia por cheque - Asignación de ganancia`
                    ]);
                }
            }
            await client.query('COMMIT');
            return updatedCheck[0];
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async handleCompleteRecoveryProfitDistribution(client, checkId, check, totalRecovered, settlementDate) {
        const transferFee = Number(check.transfer_fee || 0);
        const platformFee = Number(check.platform_fee || 0);
        const profitOrLoss = totalRecovered - Number(check.purchase_price) - transferFee - platformFee;
        const { rows: participations } = await client.query(`SELECT user_id, share FROM public.check_participations WHERE check_id = $1`, [checkId]);
        if (participations.length === 0) {
            throw new common_1.NotFoundException('No se encontraron participaciones para este cheque');
        }
        const allocationDate = settlementDate || new Date().toISOString().split('T')[0];
        for (const participation of participations) {
            const userShare = Number(participation.share);
            const allocationAmount = Number((profitOrLoss * userShare).toFixed(2));
            await client.query(`INSERT INTO public.profit_allocations 
         (check_id, user_id, currency, allocation_amount, allocation_date)
         VALUES ($1, $2, $3, $4, $5::date)`, [
                checkId,
                participation.user_id,
                check.currency,
                allocationAmount,
                allocationDate
            ]);
            const transactionType = allocationAmount >= 0 ? 'CONTRIBUTION' : 'WITHDRAWAL';
            const transactionAmount = Math.abs(allocationAmount);
            const description = allocationAmount >= 0
                ? `Ganancia por recuperación completa de cheque`
                : `Pérdida por recuperación parcial de cheque`;
            await client.query(`INSERT INTO public.user_transactions
         (user_id, currency, tx_type, amount, tx_date, description)
         VALUES ($1, $2, $3, $4, $5::date, $6)`, [
                participation.user_id,
                check.currency,
                transactionType,
                transactionAmount,
                allocationDate,
                description
            ]);
        }
    }
    remove(id) {
        return `This action removes a #${id} check`;
    }
    async getMovements(id) {
        console.log('getMovements service');
        const client = await this.databaseService.getClient();
        try {
            const { rows } = await client.query('SELECT * FROM cash_movements WHERE related_check = $1', [id]);
            return rows;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    async getCheckRecoveries(checkId) {
        const client = await this.databaseService.getClient();
        try {
            const { rows: recoveries } = await client.query(`SELECT * FROM public.check_recoveries WHERE check_id = $1 ORDER BY recovery_date DESC`, [checkId]);
            const { rows: totalRecovered } = await client.query(`SELECT COALESCE(SUM(recovered_amount), 0) as total_recovered FROM public.check_recoveries WHERE check_id = $1`, [checkId]);
            return {
                recoveries,
                totalRecovered: Number(totalRecovered[0]?.total_recovered || 0)
            };
        }
        finally {
            client.release();
        }
    }
};
exports.ChecksService = ChecksService;
exports.ChecksService = ChecksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ChecksService);
//# sourceMappingURL=checks.service.js.map