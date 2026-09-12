import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

/** Build and configure the Express application. */
export function createApp(): Express {
  const app = express();

  // Trust the first proxy so rate limiter uses the real IP behind a proxy.
  app.set('trust proxy', 1);

  // Security headers.
  app.use(helmet());

  // CORS — allow only the configured browser origins.
  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser clients (curl, tests) with no Origin header.
        if (!origin || env.corsOrigin.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  // Request logging (Apache style in prod, concise elsewhere).
  app.use(morgan(env.isProd ? 'combined' : 'dev'));

  // Parse JSON + cookies.
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // API routes.
  app.use('/api', routes);

  // 404 for unmatched API routes.
  app.use('/api', notFoundHandler);

  // Central error handler.
  app.use(errorHandler);

  return app;
}