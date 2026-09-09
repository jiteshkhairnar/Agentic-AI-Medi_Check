import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../src/types';

/**
 * Middleware to enforce role-based access control.
 * Requires the `authenticate` middleware to be executed first.
 */
export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'User not authenticated.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        error: 'Forbidden. You do not have the required permissions to access this resource.' 
      });
      return;
    }

    next();
  };
};
