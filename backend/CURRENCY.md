# Currency conversion

The supplied `Hit External API.xlsx` identifies the REST Countries API:

`https://restcountries.com/v3.1/all`

The workbook describes nested country and currency metadata. It does not provide an exchange-rate endpoint, a base currency, a target currency, a rate, or a request/response conversion contract. REST Countries must therefore not be treated as an exchange-rate service.

The application preserves source revenue and converted revenue separately. With the default configuration, conversion is intentionally unavailable:

```env
SOURCE_CURRENCY=UNSPECIFIED
TARGET_CURRENCY=
EXCHANGE_RATE_PROVIDER=none
EXCHANGE_RATE=
```

To support a real provider later, implement its rate lookup behind `src/services/currencyProvider.js`. The analytics service only consumes the provider result, so provider integration does not require changes to aggregation logic.

For local testing only, an explicitly supplied static rate can be used:

```env
EXCHANGE_RATE_PROVIDER=static
EXCHANGE_RATE=1.0
TARGET_CURRENCY=USD
```

This static option is configuration-driven and is not an exchange rate supplied by the exercise.
