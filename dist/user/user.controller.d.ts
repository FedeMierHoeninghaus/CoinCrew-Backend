import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(user: {
        userId: string;
        email: string;
    }): Promise<any>;
}
