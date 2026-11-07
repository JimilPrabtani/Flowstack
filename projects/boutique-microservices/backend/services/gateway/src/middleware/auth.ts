/**
 * Gateway authentication boundary.
 *
 * WHY THIS FILE EXISTS: the gateway previously applied helmet + cors and then
 * proxied every request straight through. It enforced nothing. Any client
 * could reach any backend route unauthenticated, because the backends assumed
 * "the gateway handles auth" and the gateway assumed nothing at all.
 *
 * Verification itself lives in shared/auth.ts. What is gateway-specific is
 * forwarding the verified identity downstream as headers, and allowing
 * anonymous access on public routes.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, bearerToken, AuthedRequest } from '../../../../shared/auth';

export { requireRole } from '../../../../shared/auth';

/**
 * Headers the gateway sets itself to convey verified identity downstream.
 * They MUST be stripped from inbound requests first — otherwise a client
 * could simply send `x-user-id: <victim>` and impersonate anyone, since the
 * backends trust these headers.
 */
export const IDENTITY_HEADERS = [
  'x-user-id',
  'x-user-email',
  'x-user-role',
  'x-authenticated',
] as const;

export function stripClientIdentityHeaders(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  for (const header of IDENTITY_HEADERS) {
    delete req.headers[header];
  }
  next();
}

function forwardIdentity(req: Request, token: string): void {
  const user = verifyAccessToken(token);
  (req as AuthedRequest).user = user;
  req.headers['x-user-id'] = user.sub;
  req.headers['x-user-email'] = user.email;
  req.headers['x-user-role'] = user.role;
  req.headers['x-authenticated'] = 'true';
}

/** Rejects the request unless a valid access token is present. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = bearerToken(req);
  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  try {
    forwardIdentity(req, token);
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

/**
 * Attaches identity when a valid token is present, but allows anonymous
 * access. Used for browsing products, where logged-in and logged-out users
 * both get a response.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = bearerToken(req);
  if (token) {
    try {
      forwardIdentity(req, token);
    } catch {
      // Invalid token on a public route: proceed as anonymous rather than
      // failing, but make sure no identity headers survive.
      for (const h of IDENTITY_HEADERS) delete req.headers[h];
    }
  }
  next();
}
