import { getAnalyticsSummary } from '../services/analyticsService.js';

export function analyticsSummaryController(request, response) {
  response.status(200).json({
    success: true,
    data: getAnalyticsSummary(request.query)
  });
}
