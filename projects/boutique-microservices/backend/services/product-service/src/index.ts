import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { productRoutes } from './routes/products';
import { connectDB } from './database/connection';
import { metricsMiddleware, setupMetrics } from './metrics';

const app = express();
const PORT = Number(process.env.PORT || 3003);

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

setupMetrics(app, { serviceName: 'product-service', serviceVersion: '1.0.0' });

app.use(metricsMiddleware);

app.get('/healthz', (_req, res) => res.json({ status: 'ok', service: 'product-service' }));

app.use('/api/products', productRoutes);
// Back-compat: gateway strips /api/products prefix before proxying.
app.use('', productRoutes);

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Product service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start product service:', error);
    process.exit(1);
  }
};

startServer();
