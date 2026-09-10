import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendDirectory = path.resolve(currentDirectory, '..');

export const config = {
  port: Number(process.env.PORT || 4000),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  dataDirectory: path.resolve(backendDirectory, process.env.DATA_DIR || 'data'),
  sourceCurrency: process.env.SOURCE_CURRENCY || 'UNSPECIFIED',
  targetCurrency: process.env.TARGET_CURRENCY || null,
  exchangeRateProvider: process.env.EXCHANGE_RATE_PROVIDER || 'none',
  exchangeRate: process.env.EXCHANGE_RATE || null,
  exchangeRateApiUrl: process.env.EXCHANGE_RATE_API_URL || null,
  exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY || null
};
