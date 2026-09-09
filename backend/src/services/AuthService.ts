import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_ISSUER = 'medicheck-api';

export class AuthService {
  /**
   * Mock Login: Authenticates user solely based on email.
   * In a real app, this would verify a password or OTP.
   */
  public static async login(email: string): Promise<{ user: any; token: string } | null> {
    const foundUser = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!foundUser) return null;

    // Remove _id for frontend compatibility
    const userToReturn = { ...foundUser, id: foundUser.id || (foundUser as any)._id.toString() };
    delete (userToReturn as any)._id;

    const payload = {
      sub: userToReturn.id,
      email: userToReturn.email,
      role: userToReturn.role,
      tenant_id: userToReturn.tenantId,
      tenant_type: userToReturn.tenantType,
      license_no: userToReturn.licenseNumber,
      permissions: userToReturn.permissions,
      iss: JWT_ISSUER
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    return { user: userToReturn, token };
  }

  /**
   * Retrieves a user by ID
   */
  public static async getUserById(id: string): Promise<any | null> {
    const user = await User.findOne({ id }).lean();
    if (!user) return null;
    const userToReturn = { ...user, id: user.id || (user as any)._id.toString() };
    delete (userToReturn as any)._id;
    return userToReturn;
  }
}
