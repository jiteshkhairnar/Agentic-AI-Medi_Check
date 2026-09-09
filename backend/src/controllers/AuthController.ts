import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  /**
   * Mock login endpoint
   * POST /api/v1/auth/login
   */
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ success: false, error: 'Email is required' });
        return;
      }

      const result = await AuthService.login(email);

      if (!result) {
        res.status(401).json({ success: false, error: 'Invalid credentials or user not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  /**
   * Get current authenticated user profile
   * GET /api/v1/auth/me
   */
  public static async me(req: Request, res: Response): Promise<void> {
    try {
      // req.user is populated by the authenticate middleware
      if (!req.user) {
        res.status(401).json({ success: false, error: 'User not authenticated' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
