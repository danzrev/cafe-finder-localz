import { createApp } from './app.js';
import { prisma } from './config/prisma.js';
import { env } from './config/env.js';

/** Boot the HTTP server after confirming the database is reachable. */
async function main() {
  await prisma.$connect();
  console.log('✔ Connected to PostgreSQL');

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`✔ Café Finder API listening on http://localhost:${env.port}`);
    console.log(`  Environment: ${env.nodeEnv}`);
  });

  // Graceful shutdown.
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully…`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
    // Force-exit if cleanup hangs.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});