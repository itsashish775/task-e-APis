// middleware/responseHandler.js

/**
 * Middleware to attach centralized response methods
 */
function responseHandler(req, res, next) {
  /**
   * Send success response
   * @param {Object} data - Data to send
   * @param {String} message - Optional message
   * @param {Number} status - HTTP status code
   */
  res.success = (data = {}, message = '', status = 200) => {
    return res.status(status).json({ message, ...data });
  };

  /**
   * Send error response
   * @param {String} message - Error message
   * @param {Number} status - HTTP status code
   * @param {Object} errors - Optional error details
   */
  res.error = (message = 'Something went wrong', status = 500, errors = null) => {
    const payload = { message };
    if (errors) payload.errors = errors;
    return res.status(status).json(payload);
  };

  next();
}

module.exports = responseHandler;
