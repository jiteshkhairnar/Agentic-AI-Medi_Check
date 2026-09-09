import jwt from 'jsonwebtoken';
import { Store } from '../store/inMemoryStore';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_ISSUER = 'medicheck-api';

export class AuthService {
  /**
   * Mock Login: Authenticates user solely based on email.
   * In a real app, this would verify a password or OTP.
   */
  public static async login(email: string): Promise<{ user: User; token: string } | null> {
    // Search in the mock store
    let foundUser: User | null = null;
    for (const [_, user] of Store.users.entries()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        foundUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: user.tenantName,
          tenantType: user.tenantType,
          licenseNumber: user.licenseNumber,
          avatar: user.avatar,
          permissions: user.permissions
        };
        break;
      }
    }

    if (!foundUser) {
      return null;
    }

    const payload = {
      sub: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
      tenant_id: foundUser.tenantId,
      tenant_name: foundUser.tenantName,
      tenant_type: foundUser.tenantType,
      license_no: foundUser.licenseNumber,
      permissions: foundUser.permissions,
      iss: JWT_ISSUER
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    return { user: foundUser, token };
  }

  /**
   * Retrieves a user by ID
   */
  public static async getUserById(id: string): Promise<User | null> {
    const user = Store.users.get(id);
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenantName,
      tenantType: user.tenantType,
      licenseNumber: user.licenseNumber,
      avatar: user.avatar,
      permissions: user.permissions
    };
  }
}
