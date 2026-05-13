import { env } from './config/env';
import { connectDb } from './config/db';
import { createApp } from './app';

async function bootstrap() {
  await connectDb();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch(err => {
  console.error('Fatal startup error', err);
  process.exit(1);
});

