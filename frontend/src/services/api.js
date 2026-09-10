import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000
});

export async function ingestSourceData() {
  await Promise.all([
    api.post('/ingest/json'),
    api.post('/ingest/xml'),
    api.post('/ingest/csv')
  ]);
}

export async function fetchAnalytics(filters, signal) {
  const params = Object.fromEntries(
    Object.entries({
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      category: filters.category || undefined,
      status: filters.status || undefined,
      page: 1,
      pageSize: 100
    }).filter(([, value]) => value !== undefined)
  );

  const response = await api.get('/analytics/summary', { params, signal });
  return response.data.data;
}
