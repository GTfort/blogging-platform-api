// middleware/errorHandler.js
const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../utils/responses");

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  // Development error response
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Production error response
  else {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or unknown error: don't leak error details
    else {
      // Log error for debugging
      console.error("ERROR 💥", err);

      // Send generic message
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};

/**
 * Catch 404 errors and forward to error handler
 */
const notFoundHandler = (req, res, next) => {
  const err = new ApiError(
    `Cannot ${req.method} ${req.originalUrl}`,
    StatusCodes.NOT_FOUND,
  );
  next(err);
};

/**
 * Handle specific database errors
 */
const handleDatabaseError = (err) => {
  let error = err;

  // MySQL duplicate entry error
  if (err.code === "ER_DUP_ENTRY") {
    const value = err.message.match(/'([^']+)'/)[1];
    error = new ApiError(
      `Duplicate field value: ${value}. Please use another value!`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // MySQL foreign key constraint error
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    error = new ApiError(
      "Referenced record does not exist",
      StatusCodes.BAD_REQUEST,
    );
  }

  // MySQL invalid data error
  if (err.code === "ER_TRUNCATED_WRONG_VALUE") {
    error = new ApiError("Invalid data provided", StatusCodes.BAD_REQUEST);
  }

  return error;
};

/**
 * Handle Joi validation errors
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ApiError(message, StatusCodes.BAD_REQUEST);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  ApiError,
  handleDatabaseError,
  handleValidationError,
};
