import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

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
        console.log("llegamos a getUserById", {userId});
        const {rows, rowCount} = await this.databaseService.query('select * from users where id = $1', [userId]);
        if(rowCount === 0){
            throw new NotFoundException('Usuario no encontrado');
        }
        const user = rows[0];
        const {password: _, ...safeUser} = user;
        console.log("devolviendo safeUser");
        console.log("safeUser", safeUser);
        return safeUser;
    }
}
