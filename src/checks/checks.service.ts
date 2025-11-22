import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { DatabaseService } from 'src/database/database.service';
import { CheckStatus } from 'src/common/enums/check-status';
@Injectable()
export class ChecksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCheckDto: CreateCheckDto) {
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
        if(check.length === 0){
          throw new NotFoundException('Cheque no creado');
        }
        const {rows: fundAccounts} = await client.query(`SELECT * FROM fund_accounts WHERE currency = $1`, [createCheckDto.currency]);
        if(fundAccounts.length === 0){
          throw new NotFoundException('Fondo no encontrado');
        }
        const fundId = fundAccounts[0].id;

        await client.query(`insert into cash_movements (fund_id, movement_date, type, description, amount, related_check)
          values ($1, $2::date, 'COMPRA_CHEQUE', $3, $4, $5)`, [fundId, createCheckDto.purchase_date, 'COMPRA_CHEQUE', -createCheckDto.purchase_price, check[0].id]);
        if(Number(check[0].platform_fee) > 0){
          await client.query(`insert into cash_movements (fund_id, movement_date, type, description, amount, related_check)
            values ($1, $2::date, 'COMISION_MIFINANZAS', $3, $4, $5)`, [fundId, createCheckDto.purchase_date, 'COMISION_PLATAFORMA', -Number(check[0].platform_fee), check[0].id]);
        }
        if(Number(check[0].transfer_fee) > 0){
          await client.query(`insert into cash_movements (fund_id, movement_date, type, description, amount, related_check)
            values ($1, $2::date, 'COMISION_BANCARIA', $3, $4, $5)`, [fundId, createCheckDto.purchase_date, 'COMISION_TRANSFERENCIA', -Number(check[0].transfer_fee), check[0].id]);
        }


        const {rows: balance } = await client.query(`WITH balances AS (
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
        
        // Convertir balances a números antes de sumar
        const total = balance.reduce((acc, curr) => acc + Number(curr.balance), 0);
        
        if(total <= 0){
          throw new NotFoundException('No hay fondos disponibles');
        }
        for (const b of balance) {
          const userBalance = Number(b.balance);
          const share = Number((userBalance / total).toFixed(10)); // NUMERIC(12,10)
  
          await client.query(
            `INSERT INTO public.check_participations
               (check_id, user_id, share, basis_user_balance, basis_total_balance)
             VALUES
               ($1, $2, $3, $4, $5);`,
            [
              check[0].id,
              b.user_id,
              share,
              userBalance,
              total,
            ],
          );
        }
        await client.query('COMMIT');
        return check[0];
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

  async findAll() {
    console.log('findAll service');
    const client = await this.databaseService.getClient();
    try {
      const {rows: checks} = await client.query(`SELECT * FROM public.checks`);
      console.log('checks', checks);
      return checks;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async findOne(id: string) {
    console.log("entramos a findOne service");
    const client = await this.databaseService.getClient();
    try {
      const {rows: check} = await client.query(`SELECT * FROM public.checks WHERE id = $1`, [id]);
      console.log('check', check);
      return check[0];
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: string, updateCheckDto: UpdateCheckDto) {

    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');

      // Verificar que el cheque existe
      const { rows: existingCheck } = await client.query(
        `SELECT * FROM public.checks WHERE id = $1`,
        [id]
      );
      if (existingCheck.length === 0) {
        throw new NotFoundException('Cheque no encontrado');
      }
      //existe? si
      const check = existingCheck[0];
      const previousStatus = check.status;

      // Construir la query de actualización dinámicamente
      const updateFields: string[] = [];
      const updateValues: any[] = [];
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

      // Agregar el ID al final para el WHERE
      updateValues.push(id);
      const updateQuery = `
        UPDATE public.checks
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *;
      `;

      const { rows: updatedCheck } = await client.query(updateQuery, updateValues);

      // Si el estado cambió a COBRADO, crear movimiento de caja y asignar ganancias
      if (updateCheckDto.status === CheckStatus.COBRADO && previousStatus !== CheckStatus.COBRADO) {
        if (!updateCheckDto.settled_date) {
          throw new Error('La fecha de cobro (settled_date) es requerida cuando el estado es COBRADO');
        }

        // Obtener el fondo asociado
        const { rows: fundAccounts } = await client.query(
          `SELECT * FROM fund_accounts WHERE currency = $1`,
          [check.currency]
        );

        if (fundAccounts.length === 0) {
          throw new NotFoundException('Fondo no encontrado');
        }

        const fundId = fundAccounts[0].id;

        // Crear movimiento de caja positivo por el valor nominal del cheque
        await client.query(
          `INSERT INTO cash_movements (fund_id, movement_date, type, description, amount, related_check)
           VALUES ($1, $2::date, 'COBRO_CHEQUE', 'Cobro de cheque', $3, $4)`,
          [fundId, updateCheckDto.settled_date, check.face_value, id]
        );

        // Usar valores actualizados si están disponibles, sino los originales
        const finalCheck = updatedCheck[0] || check;
        const transferFee = updateCheckDto.transfer_fee !== undefined 
          ? updateCheckDto.transfer_fee 
          : Number(finalCheck.transfer_fee || 0);
        const platformFee = updateCheckDto.platform_fee !== undefined 
          ? updateCheckDto.platform_fee 
          : Number(finalCheck.platform_fee || 0);

        // Calcular la ganancia: face_value - purchase_price - transfer_fee - platform_fee
        const profit = Number(finalCheck.face_value) 
          - Number(finalCheck.purchase_price) 
          - transferFee 
          - platformFee;

        // Obtener todas las participaciones del cheque
        const { rows: participations } = await client.query(
          `SELECT user_id, share FROM public.check_participations WHERE check_id = $1`,
          [id]
        );

        if (participations.length === 0) {
          throw new NotFoundException('No se encontraron participaciones para este cheque');
        }

        // Distribuir la ganancia entre los participantes según su share
        const allocationDate = updateCheckDto.settled_date || new Date().toISOString().split('T')[0];

        for (const participation of participations) {
          const userShare = Number(participation.share);
          const allocationAmount = Number((profit * userShare).toFixed(2));

          // Insertar asignación de ganancia en profit_allocations
          await client.query(
            `INSERT INTO public.profit_allocations 
             (check_id, user_id, currency, allocation_amount, allocation_date)
             VALUES ($1, $2, $3, $4, $5::date)`,
            [
              id,
              participation.user_id,
              finalCheck.currency,
              allocationAmount,
              allocationDate
            ]
          );
          await client.query(
            `INSERT INTO public.user_transactions
             (user_id, currency, tx_type, amount, tx_date, description)
             VALUES ($1, $2, 'CONTRIBUTION', $3, $4::date, $5)`,
            [
              participation.user_id,
              finalCheck.currency,
              allocationAmount,
              allocationDate,
              `Ganancia por cheque - Asignación de ganancia`
            ]
          );
        }
      }

      await client.query('COMMIT');
      return updatedCheck[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} check`;
  }

  async getMovements(id: string) {
    console.log('getMovements service');
    const client = await this.databaseService.getClient();
    try {
      const { rows } = await client.query('SELECT * FROM cash_movements WHERE related_check = $1', [id]);
      return rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}
