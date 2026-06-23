import { User } from '../models/User';
import { AuthMiddleware } from '../middleware/auth';
import { LoginDTO, RegisterDTO, AuthTokens } from '../types';
import bcrypt from 'bcrypt';

export class AuthService {
  static async login(data: LoginDTO): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    const { username, password } = data;

    const user = await User.findOne({
      where: {
        ...(username.includes('@') 
          ? { email: username.toLowerCase() } 
          : { username: username }),
      },
    });

    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    if (!user.password_hash) {
      await user.destroy();
      throw Object.assign(
        new Error('Account was corrupted. Please register again.'), 
        { statusCode: 400 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    if (!user.is_active) {
      throw Object.assign(new Error('Account is deactivated'), { statusCode: 403 });
    }

    await user.updateLastLogin();

    const tokens = AuthMiddleware.generateTokens(user.id, user.role);

    return {
      user: user.toSafeObject(),
      tokens,
    };
  }

  static async register(data: RegisterDTO): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        ...(data.email ? { email: data.email.toLowerCase() } : {}),
        ...(data.username ? { username: data.username } : {}),
      },
    });

    if (existingUser) {
      // If existing user has NULL password, delete it
      if (!existingUser.password_hash) {
        await existingUser.destroy();
      } else {
        const field = existingUser.email === data.email?.toLowerCase() ? 'Email' : 'Username';
        throw Object.assign(new Error(`${field} already exists`), { statusCode: 409 });
      }
    }

    // ✅ Hash password manually before creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create user with pre-hashed password
    const user = await User.create({
      username: data.username,
      email: data.email,
      password_hash: hashedPassword, // Set hash directly
      role: data.role || 'staff',
    } as any);

    console.log('✅ User created with hash:', hashedPassword.substring(0, 20) + '...');

    const tokens = AuthMiddleware.generateTokens(user.id, user.role);

    return {
      user: user.toSafeObject(),
      tokens,
    };
  }

  static async getProfile(userId: number): Promise<Partial<User>> {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return user;
  }
}