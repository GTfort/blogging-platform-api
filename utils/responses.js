// utils/responses.js
const { StatusCodes } = require("http-status-codes");

/**
 * Standard response format for success
 */
const success = (res, message, data = {}) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    message,
    ...data,
  });
};

/**
 * Created response (201)
 */
const created = (res, message, data = {}) => {
  res.status(StatusCodes.CREATED).json({
    status: "success",
    message,
    ...data,
  });
};

/**
 * No content response (204)
 */
const noContent = (res) => {
  res.status(StatusCodes.NO_CONTENT).end();
};

/**
 * Bad request response (400)
 */
const badRequest = (res, message, errors = {}) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    status: "error",
    message,
    errors,
  });
};

/**
 * Unauthorized response (401)
 */
const unauthorized = (res, message = "Unauthorized") => {
  res.status(StatusCodes.UNAUTHORIZED).json({
    status: "error",
    message,
  });
};

/**
 * Forbidden response (403)
 */
const forbidden = (res, message = "Forbidden") => {
  res.status(StatusCodes.FORBIDDEN).json({
    status: "error",
    message,
  });
};

/**
 * Not found response (404)
 */
const notFound = (res, message = "Resource not found") => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: "error",
    message,
  });
};

/**
 * Conflict response (409)
 */
const conflict = (res, message = "Conflict occurred") => {
  res.status(StatusCodes.CONFLICT).json({
    status: "error",
    message,
  });
};

/**
 * Validation error response (422)
 */
const validationError = (res, message, errors) => {
  res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    status: "error",
    message,
    errors,
  });
};

/**
 * Internal server error response (500)
 */
const internalServerError = (res, message = "Internal server error") => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message,
  });
};

/**
 * Generic error response
 */
const errorResponse = (res, message, statusCode = StatusCodes.BAD_REQUEST) => {
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

/**
 * Pagination metadata
 */
const paginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = {
  success,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  validationError,
  internalServerError,
  errorResponse,
  paginationMeta,
};
