import { User } from '../models/User';
import { AuthMiddleware } from '../middleware/auth';
import { LoginDTO, RegisterDTO, AuthTokens } from '../types';

export class AuthService {
  static async login(data: LoginDTO): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    const { username, password } = data;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        // Sequelize OR condition
        ...(username.includes('@') 
          ? { email: username.toLowerCase() } 
          : { username: username }),
      },
    });

    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    // Check if user is active
    if (!user.is_active) {
      throw Object.assign(new Error('Account is deactivated'), { statusCode: 403 });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate tokens
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
        // Check both email and username
        ...(data.email ? { email: data.email.toLowerCase() } : {}),
        ...(data.username ? { username: data.username } : {}),
      },
    });

    if (existingUser) {
      const field = existingUser.email === data.email?.toLowerCase() ? 'Email' : 'Username';
      throw Object.assign(new Error(`${field} already exists`), { statusCode: 409 });
    }

    // Create user
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: data.password, // Will be hashed by model hook
      role: data.role || 'staff',
    });

    // Generate tokens
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