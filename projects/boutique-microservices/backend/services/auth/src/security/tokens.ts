/**
 * Token issuance. Verification of *access* tokens lives in shared/auth.ts,
 * since every service does it; only the auth service signs.
 *
 * REPLACES: `token: user.id.toString()` — the old scheme handed the client
 * its own primary key and then trusted whatever ID came back in the
 * Authorization header. Anyone holding a user ID had a permanent session
 * that could not be expired or revoked.
 *
 * Access tokens  — signed, short-lived (15m), sent in the Authorization header.
 * Refresh tokens — signed, long-lived (7d), carry a unique `jti` recorded in
 *                  the database so logout and reuse-detection actually work.
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { config } from '../config/env';
import { AccessTokenPayload } from '../../../../shared/auth';

export type { AccessTokenPayload };

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: config.jwt.accessTtl as SignOptions['expiresIn'],
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
    subject: payload.sub,
  };
  return jwt.sign(
    { email: payload.email, role: payload.role },
    config.jwt.accessSecret,
    options
  );
}

export function signRefreshToken(userId: string): { token: string; jti: string } {
  const jti = randomUUID();
  const options: SignOptions = {
    expiresIn: config.jwt.refreshTtl as SignOptions['expiresIn'],
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
    subject: userId,
    jwtid: jti,
  };
  const token = jwt.sign({}, config.jwt.refreshSecret, options);
  return { token, jti };
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, config.jwt.refreshSecret, {
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
    algorithms: ['HS256'], // pin the algorithm — blocks `alg: none` and
                           // HS/RS confusion attacks
  }) as jwt.JwtPayload;

  if (!decoded.jti) {
    throw new Error('Refresh token is missing its jti claim');
  }

  return { sub: String(decoded.sub), jti: String(decoded.jti) };
}

/** Milliseconds until a refresh token expires — used to set the DB row's TTL. */
export function refreshTtlMs(): number {
  const match = /^(\d+)([smhd])$/.exec(config.jwt.refreshTtl);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return Number(match[1]) * multipliers[match[2]];
}
