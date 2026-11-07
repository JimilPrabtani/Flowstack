import {
  required,
  optional,
  optionalInt,
  optionalList,
} from '../../../../shared/env';

export const config = {
  nodeEnv: optional('NODE_ENV', 'development'),
  isProduction: optional('NODE_ENV', 'development') === 'production',
  // Accept either GATEWAY_PORT or PORT. The old code read only GATEWAY_PORT
  // while every manifest set PORT — it worked purely because the hardcoded
  // fallback happened to match the intended port.
  port: optionalInt('GATEWAY_PORT', optionalInt('PORT', 3001)),

  cors: {
    allowedOrigins: optionalList('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'),
  },

  rateLimit: {
    windowMs: optionalInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    max: optionalInt('RATE_LIMIT_MAX_REQUESTS', 100),
    authMax: optionalInt('AUTH_RATE_LIMIT_MAX', 5),
  },

  services: {
    auth: required('AUTH_SERVICE_URL'),
    products: required('PRODUCTS_SERVICE_URL'),
    orders: required('ORDERS_SERVICE_URL'),
    users: required('USERS_SERVICE_URL'),
  },
};
