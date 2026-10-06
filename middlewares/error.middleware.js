export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

// Central error handler. Never sends a stack trace to the client.
export function errorHandler(error, req, res, next) {
  // Zod validation failed
  if (error.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Broken JSON in the request body
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  // Invalid ObjectId
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }

  // Mongoose schema validation
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  // Duplicate key (for example an email that already exists)
  if (error.code === 11000) {
    return res.status(409).json({ message: 'Resource already exists' });
  }

  console.error('Unexpected error:', error.message);
  res.status(500).json({ message: 'Internal server error' });
}
