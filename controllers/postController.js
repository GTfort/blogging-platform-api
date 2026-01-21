// controllers/postController.js
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post");
const {
  success,
  created,
  noContent,
  notFound,
  errorResponse,
} = require("../utils/responses");

class PostController {
  // Create a new blog post
  static createPost = asyncHandler(async (req, res) => {
    const postData = req.validatedBody;

    try {
      const post = await Post.create(postData);

      created(res, "Post created successfully", {
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          status: post.status,
          view_count: post.view_count,
          created_at: post.created_at,
          updated_at: post.updated_at,
        },
      });
    } catch (error) {
      errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  // Get all blog posts with filtering and pagination
  static getAllPosts = asyncHandler(async (req, res) => {
    const query = req.validatedQuery;

    try {
      const result = await Post.findAll(query);

      success(res, "Posts retrieved successfully", {
        posts: result.posts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          status: post.status,
          view_count: post.view_count,
          created_at: post.created_at,
          updated_at: post.updated_at,
        })),
        pagination: result.pagination,
      });
    } catch (error) {
      errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  // Get a single blog post by ID
  static getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const post = await Post.findById(id);

      if (!post) {
        return notFound(res, `Post with ID ${id} not found`);
      }

      success(res, "Post retrieved successfully", {
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          status: post.status,
          view_count: post.view_count,
          created_at: post.created_at,
          updated_at: post.updated_at,
        },
      });
    } catch (error) {
      errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  // Get a single blog post by slug
  static getPostBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    try {
      const post = await Post.findBySlug(slug);

      if (!post) {
        return notFound(res, `Post with slug "${slug}" not found`);
      }

      success(res, "Post retrieved successfully", {
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          status: post.status,
          view_count: post.view_count,
          created_at: post.created_at,
          updated_at: post.updated_at,
        },
      });
    } catch (error) {
      errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  // Update a blog post
  static updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.validatedBody;

    try {
      const updatedPost = await Post.update(id, updateData);

      if (!updatedPost) {
        return notFound(res, `Post with ID ${id} not found`);
      }

      success(res, "Post updated successfully", {
        post: {
          id: updatedPost.id,
          title: updatedPost.title,
          slug: updatedPost.slug,
          content: updatedPost.content,
          excerpt: updatedPost.excerpt,
          category: updatedPost.category,
          tags: updatedPost.tags,
          status: updatedPost.status,
          view_count: updatedPost.view_count,
          created_at: updatedPost.created_at,
          updated_at: updatedPost.updated_at,
        },
      });
    } catch (error) {
      errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  // Delete a blog post
  static deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await Post.delete(id);

      if (!deleted) {
        return notFound(res, `Post with ID ${id} not found`);
      }

      noContent(res);
    } catch (error) {
      errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  // Get blog statistics
  static getStatistics = asyncHandler(async (req, res) => {
    try {
      const stats = await Post.getStatistics();

      success(res, "Statistics retrieved successfully", {
        statistics: stats,
      });
    } catch (error) {
      errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  // Search blog posts
  static searchPosts = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return badRequest(res, "Search query is required");
    }

    try {
      const result = await Post.findAll({
        search: q.trim(),
        limit: 20,
      });

      success(res, "Search results retrieved successfully", {
        query: q,
        results: result.posts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          view_count: post.view_count,
          created_at: post.created_at,
        })),
        total: result.pagination.total,
        count: result.posts.length,
      });
    } catch (error) {
      errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
}

module.exports = PostController;
