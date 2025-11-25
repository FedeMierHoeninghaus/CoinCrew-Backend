import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: any;
    }>;
    login(loginDto: loginDto): Promise<{
        access_token: string;
        user: any;
    }>;
}
