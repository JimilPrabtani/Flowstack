import {
  required,
  requiredSecret,
  optional,
  optionalInt,
  optionalList,
} from '../../../../shared/env';

const accessSecret = requiredSecret('JWT_ACCESS_SECRET');
const refreshSecret = requiredSecret('JWT_REFRESH_SECRET');

// Reusing one secret for both token types lets an attacker present a
// long-lived refresh token wherever an access token is accepted.
if (accessSecret === refreshSecret) {
  throw new Error(
    '[config] JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values.'
  );
}

export const config = {
  nodeEnv: optional('NODE_ENV', 'development'),
  isProduction: optional('NODE_ENV', 'development') === 'production',
  port: optionalInt('PORT', 3002),

  databaseUrl: required('DATABASE_URL'),

  jwt: {
    accessSecret,
    refreshSecret,
    accessTtl: optional('JWT_ACCESS_TTL', '15m'),
    refreshTtl: optional('JWT_REFRESH_TTL', '7d'),
    issuer: optional('JWT_ISSUER', 'boutique-auth'),
    audience: optional('JWT_AUDIENCE', 'boutique-api'),
  },

  bcryptRounds: optionalInt('BCRYPT_ROUNDS', 12),

  // Explicit allowlist. `cors()` with no arguments emits
  // `Access-Control-Allow-Origin: *`, which cannot be used with credentials
  // and lets any site call the API from a victim's browser.
  cors: {
    allowedOrigins: optionalList('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'),
  },

  cookie: {
    secure: optional('COOKIE_SECURE', 'false') === 'true',
    sameSite: optional('COOKIE_SAMESITE', 'lax') as 'lax' | 'strict' | 'none',
    name: 'boutique_rt',
  },

  rateLimit: {
    windowMs: optionalInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    authMax: optionalInt('AUTH_RATE_LIMIT_MAX', 5),
  },
};

export type Config = typeof config;
