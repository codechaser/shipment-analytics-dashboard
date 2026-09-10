import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import ingestionRoutes from './routes/ingestionRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler, notFoundHandler } from './utils/errorHandler.js';

export const app = express();

const allowedOrigins = config.corsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed by CORS.'));
  }
}));
app.use(express.json());

app.get('/health', (request, response) => {
  response.json({ success: true, status: 'ok' });
});

app.use('/ingest', ingestionRoutes);
app.use('/analytics', analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
