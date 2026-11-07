import {
  required,
  optional,
  optionalInt,
  optionalList,
} from '../../../../shared/env';

export const config = {
  nodeEnv: optional('NODE_ENV', 'development'),
  isProduction: optional('NODE_ENV', 'development') === 'production',
  port: optionalInt('PORT', 3005),
  databaseUrl: required('DATABASE_URL'),
  productsServiceUrl: required('PRODUCTS_SERVICE_URL'),

  cors: {
    allowedOrigins: optionalList('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'),
  },
};
