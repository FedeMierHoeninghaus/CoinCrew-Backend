import { DatabaseService } from 'src/database/database.service';
export declare class UserService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    validateUser(email: string, password: string): Promise<any>;
    getUserById(userId: string): Promise<any>;
}
