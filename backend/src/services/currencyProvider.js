import { config } from '../config.js';

export function createCurrencyProvider() {
  if (config.exchangeRateProvider === 'static') {
    return {
      name: 'static',
      getRate() {
        const rate = Number(config.exchangeRate);
        return Number.isFinite(rate) && rate >= 0 ? rate : null;
      }
    };
  }

  return {
    name: config.exchangeRateProvider,
    getRate() {
      return null;
    }
  };
}
