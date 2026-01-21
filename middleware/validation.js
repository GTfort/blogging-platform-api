// middleware/validation.js
const Joi = require("joi");
const { badRequest } = require("../utils/responses");

// Post validation schema
const postSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 255 characters",
  }),

  content: Joi.string().min(10).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters long",
  }),

  category: Joi.string().max(100).default("General").messages({
    "string.max": "Category cannot exceed 100 characters",
  }),

  tags: Joi.array().items(Joi.string().max(50)).max(10).default([]).messages({
    "array.max": "Maximum 10 tags allowed",
    "string.max": "Tag cannot exceed 50 characters",
  }),

  status: Joi.string()
    .valid("draft", "published", "archived")
    .default("draft")
    .messages({
      "any.only": "Status must be either draft, published, or archived",
    }),
});

// Update post validation schema (all fields optional)
const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(255).messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 255 characters",
  }),

  content: Joi.string().min(10).messages({
    "string.min": "Content must be at least 10 characters long",
  }),

  category: Joi.string().max(100).messages({
    "string.max": "Category cannot exceed 100 characters",
  }),

  tags: Joi.array().items(Joi.string().max(50)).max(10).messages({
    "array.max": "Maximum 10 tags allowed",
    "string.max": "Tag cannot exceed 50 characters",
  }),

  status: Joi.string().valid("draft", "published", "archived").messages({
    "any.only": "Status must be either draft, published, or archived",
  }),
});

// Query parameters validation schema
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),

  status: Joi.string()
    .valid("draft", "published", "archived", "all")
    .default("published")
    .messages({
      "any.only": "Status must be either draft, published, archived, or all",
    }),

  category: Joi.string().max(100).messages({
    "string.max": "Category cannot exceed 100 characters",
  }),

  tag: Joi.string().max(50).messages({
    "string.max": "Tag cannot exceed 50 characters",
  }),

  search: Joi.string().max(255).messages({
    "string.max": "Search term cannot exceed 255 characters",
  }),

  sortBy: Joi.string()
    .valid("created_at", "updated_at", "title", "view_count")
    .default("created_at")
    .messages({
      "any.only":
        "Sort by must be one of: created_at, updated_at, title, view_count",
    }),

  sortOrder: Joi.string().valid("ASC", "DESC").default("DESC").messages({
    "any.only": "Sort order must be either ASC or DESC",
  }),
});

// Validation middleware
const validatePost = (req, res, next) => {
  const { error, value } = postSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return badRequest(res, "Validation failed", { errors });
  }

  req.validatedBody = value;
  next();
};

const validateUpdatePost = (req, res, next) => {
  const { error, value } = updatePostSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return badRequest(res, "Validation failed", { errors });
  }

  req.validatedBody = value;
  next();
};

const validateQuery = (req, res, next) => {
  const { error, value } = querySchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return badRequest(res, "Query validation failed", { errors });
  }

  req.validatedQuery = value;
  next();
};

module.exports = {
  validatePost,
  validateUpdatePost,
  validateQuery,
};
