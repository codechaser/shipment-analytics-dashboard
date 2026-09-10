export function notFoundHandler(request, response) {
  response.status(404).json({
    success: false,
    error: `Route not found: ${request.method} ${request.originalUrl}`
  });
}

export function errorHandler(error, request, response, next) {
  const statusCode = error.statusCode || 500;
  const payload = {
    success: false,
    error: error.message || 'Internal server error'
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json(payload);
}
