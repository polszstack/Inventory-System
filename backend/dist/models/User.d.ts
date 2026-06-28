import { Model } from 'sequelize-typescript';
import { Transaction } from './Transaction';
export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    STAFF = "staff"
}
export declare class User extends Model {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    password?: string;
    role: UserRole;
    is_active: boolean;
    last_login: Date | null;
    transactions: Transaction[];
    created_at: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    updateLastLogin(): Promise<void>;
    static hashPassword(instance: User): Promise<void>;
    toSafeObject(): Partial<User>;
}
export default User;
//# sourceMappingURL=User.d.ts.map