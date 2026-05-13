import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import pricingRoutes from './routes/pricingRoutes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/api/pricing', pricingRoutes);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error('Unhandled error', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

