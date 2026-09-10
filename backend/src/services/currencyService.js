import { config } from '../config.js';
import { createCurrencyProvider } from './currencyProvider.js';

export function getCurrencyConversion(sourceRevenue) {
  const provider = createCurrencyProvider();
  const configuredRate = provider.getRate();
  const hasUsableRate = configuredRate !== null && config.targetCurrency;

  return {
    sourceRevenue,
    sourceCurrency: config.sourceCurrency,
    targetCurrency: config.targetCurrency,
    exchangeRate: hasUsableRate ? configuredRate : null,
    convertedRevenue: hasUsableRate ? sourceRevenue * configuredRate : null,
    provider: provider.name,
    conversionAvailable: hasUsableRate,
    note: hasUsableRate
      ? 'Conversion used the explicitly configured static EXCHANGE_RATE.'
      : 'The supplied exercise only provides REST Countries currency metadata, not exchange rates; source revenue is preserved without conversion.'
  };
}
