import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/AuthService';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    
    // Fetch user from DB (or memory)
    // We could just use the payload to construct the user, but fetching ensures the user still exists
    // and hasn't been disabled.
    if (!decoded.sub) {
      res.status(401).json({ success: false, error: 'Invalid token payload.' });
      return;
    }

    const user = await AuthService.getUserById(decoded.sub);
    
    if (!user) {
      res.status(401).json({ success: false, error: 'User no longer exists.' });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, error: 'Token has expired.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, error: 'Invalid token.' });
    } else {
      res.status(500).json({ success: false, error: 'Internal server error during authentication.' });
    }
  }
};
