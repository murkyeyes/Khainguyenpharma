const { ZodError } = require('zod');

/**
 * Express middleware to validate request body, query, and params using a Zod Schema
 * @param {import('zod').AnyZodObject} schema 
 */
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error && error.name === 'ZodError') {
      const issues = error.issues || error.errors || [];
      const formattedErrors = issues.map((err) => {
        const pathArray = err.path || [];
        return {
          path: pathArray.length > 0 ? pathArray[pathArray.length - 1] : 'unknown',
          msg: err.message,
        };
      });
      return res.status(400).json({ error: 'Dữ liệu đầu vào không hợp lệ', details: formattedErrors });
    }
    // For other unexpected errors
    return res.status(400).json({ error: 'Lỗi validate dữ liệu' });
  }
};

module.exports = validate;
