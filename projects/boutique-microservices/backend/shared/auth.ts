/**
 * Access-token verification and route guards, shared by every service.
 *
 * Backends must NOT trust the gateway's x-user-* headers alone: anything with
 * network access to the pod could set them directly and impersonate a user.
 * Each service re-verifies the token itself.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { requiredSecret, optional } from './env';

const jwtConfig = {
  accessSecret: requiredSecret('JWT_ACCESS_SECRET'),
  issuer: optional('JWT_ISSUER', 'boutique-auth'),
  audience: optional('JWT_AUDIENCE', 'boutique-api'),
};

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthedRequest extends Request {
  user: AccessTokenPayload;
}

/** Throws if the token is missing, expired, forged, or signed with a bad alg. */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, jwtConfig.accessSecret, {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    algorithms: ['HS256'], // pin the algorithm — blocks `alg: none` and
                           // HS/RS confusion attacks
  }) as jwt.JwtPayload;

  return {
    sub: String(decoded.sub),
    email: String(decoded.email ?? ''),
    role: String(decoded.role ?? 'customer'),
  };
}

/** Bearer token from an Authorization header, or null. */
export function bearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = bearerToken(req);
  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  try {
    (req as AuthedRequest).user = verifyAccessToken(token);
    next();
  } catch {
    // Do not echo the library's error — "jwt expired" vs "invalid signature"
    // tells an attacker which part of their forgery attempt was wrong.
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthedRequest).user;
    if (!user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }
    if (!roles.includes(user.role)) {
      res.status(403).json({ success: false, error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
