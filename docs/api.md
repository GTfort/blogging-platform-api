# Blogging Platform API Documentation

## Base URL

http://localhost:3000/api/v1

## Authentication

Currently, authentication is not required for basic CRUD operations.

## Endpoints

### Posts

#### Create a Post

```http
POST /posts
Request Body:
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post.",
  "category": "Technology",
  "tags": ["Tech", "Programming"],
  "status": "published"
}

Response (201 Created):
{
  "status": "success",
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "content": "This is the content of my first blog post.",
    "excerpt": "This is the content of my first blog post...",
    "category": "Technology",
    "tags": ["Tech", "Programming"],
    "status": "published",
    "view_count": 0,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}

Get All Posts
GET /posts
Query Parameters:

page (optional): Page number (default: 1)

limit (optional): Items per page (default: 10, max: 100)

status (optional): Filter by status (draft, published, archived, all)

category (optional): Filter by category

tag (optional): Filter by tag

search (optional): Search term

sortBy (optional): Sort field (created_at, updated_at, title, view_count)

sortOrder (optional): Sort order (ASC, DESC)
```

Response (200 OK):

json
{
"status": "success",
"message": "Posts retrieved successfully",
"posts": [...],
"pagination": {
"page": 1,
"limit": 10,
"total": 25,
"totalPages": 3,
"hasNextPage": true,
"hasPrevPage": false
}
}
Get Single Post
http
GET /posts/:id
or

http
GET /posts/slug/:slug
Response (200 OK):

json
{
"status": "success",
"message": "Post retrieved successfully",
"post": {
"id": 1,
"title": "My First Blog Post",
"slug": "my-first-blog-post",
"content": "This is the content of my first blog post.",
"excerpt": "This is the content of my first blog post...",
"category": "Technology",
"tags": ["Tech", "Programming"],
"status": "published",
"view_count": 150,
"created_at": "2024-01-15T10:30:00.000Z",
"updated_at": "2024-01-15T10:30:00.000Z"
}
}
Update Post
http
PUT /posts/:id
or

http
PATCH /posts/:id
Request Body: (partial updates allowed for PATCH)

json
{
"title": "Updated Blog Post",
"content": "Updated content",
"category": "Updated Category",
"tags": ["Updated", "Tags"],
"status": "published"
}
Response (200 OK):

json
{
"status": "success",
"message": "Post updated successfully",
"post": {
"id": 1,
"title": "Updated Blog Post",
"slug": "updated-blog-post",
"content": "Updated content",
"excerpt": "Updated content...",
"category": "Updated Category",
"tags": ["Updated", "Tags"],
"status": "published",
"view_count": 150,
"created_at": "2024-01-15T10:30:00.000Z",
"updated_at": "2024-01-15T11:30:00.000Z"
}
}
Delete Post
http
DELETE /posts/:id
Response: 204 No Content

Search
http
GET /posts/search?q=search+term
Response (200 OK):

json
{
"status": "success",
"message": "Search results retrieved successfully",
"query": "search term",
"results": [...],
"total": 5,
"count": 5
}
Statistics
http
GET /posts/statistics
Response (200 OK):

json
{
"status": "success",
"message": "Statistics retrieved successfully",
"statistics": {
"total_posts": 25,
"published_posts": 20,
"draft_posts": 5,
"total_views": 1500,
"total_categories": 8,
"total_tags": 15,
"latest_post_date": "2024-01-15T10:30:00.000Z",
"popular_posts": [...]
}
}
Error Responses
400 Bad Request
json
{
"status": "error",
"message": "Validation failed",
"errors": [
{
"field": "title",
"message": "Title must be at least 3 characters long"
}
]
}
404 Not Found
json
{
"status": "error",
"message": "Post with ID 999 not found"
}
500 Internal Server Error
json
{
"status": "error",
"message": "Internal server error"
}
Status Codes
200: Success

201: Created

204: No Content

400: Bad Request

404: Not Found

500: Internal Server Error
