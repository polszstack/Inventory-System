import { User } from '../models/User';
import { LoginDTO, RegisterDTO, AuthTokens } from '../types';
export declare class AuthService {
    static login(data: LoginDTO): Promise<{
        user: Partial<User>;
        tokens: AuthTokens;
    }>;
    static register(data: RegisterDTO): Promise<{
        user: Partial<User>;
        tokens: AuthTokens;
    }>;
    static getProfile(userId: number): Promise<Partial<User>>;
}
//# sourceMappingURL=authService.d.ts.map