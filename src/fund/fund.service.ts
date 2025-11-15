import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserTransactionDto } from 'src/user/DTOs/user-transaction.dto';

@Injectable()
export class FundService {
  constructor(private readonly databaseService: DatabaseService){}

  async postFundMovement(client: any, p: {
    fundId: number;
    userTxType: 'CONTRIBUTION'|'WITHDRAWAL';
    amount: number;
    date?: string;
    description?: string|null;
    relatedUserTxId?: string|null;
    relatedCheckId?: string|null;
  }) {
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

  async getFunds(){
    console.log('getFunds');
    const { rows } = await this.databaseService.query('SELECT * FROM public.v_fund_balance');
    console.log('rows', rows);
    return rows;
  }
}
