export function validateRequest(schema, source = 'body') {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.') || 'root';
          formattedErrors[field] = err.message;
        });
        return res.status(400).json({
          success: false,
          message: error.errors[0]?.message || 'Validation error',
          errors: formattedErrors,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
      });
    }
  };
}

export default validateRequest;
