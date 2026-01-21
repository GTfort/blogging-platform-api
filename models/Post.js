// models/Post.js
const database = require("../config/database");

class Post {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.slug = data.slug || this.generateSlug(data.title);
    this.content = data.content;
    this.excerpt = data.excerpt || this.generateExcerpt(data.content);
    this.category = data.category || "General";
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    this.status = data.status || "draft";
    this.view_count = data.view_count || 0;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  }

  generateExcerpt(content, length = 200) {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > length
      ? plainText.substring(0, length) + "..."
      : plainText;
  }

  // Create a new post
  static async create(postData) {
    try {
      const post = new Post(postData);

      // First, create the post
      const [result] = await database.query(
        `INSERT INTO posts
                 (title, slug, content, excerpt, category, status)
                 VALUES (?, ?, ?, ?, ?, ?)`,
        [
          post.title,
          post.slug,
          post.content,
          post.excerpt,
          post.category,
          post.status,
        ],
      );

      const postId = result.insertId;

      // Handle tags if provided
      if (post.tags.length > 0) {
        await this.handleTags(postId, post.tags);
      }

      // Return the created post
      return await this.findById(postId);
    } catch (error) {
      throw error;
    }
  }

  // Get all posts with pagination and filtering
  static async findAll({
    page = 1,
    limit = 10,
    status = "published",
    category = null,
    tag = null,
    search = null,
    sortBy = "created_at",
    sortOrder = "DESC",
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      const conditions = [];
      const params = [];

      // Build WHERE conditions
      if (status) {
        conditions.push("p.status = ?");
        params.push(status);
      }

      if (category) {
        conditions.push("p.category = ?");
        params.push(category);
      }

      if (tag) {
        conditions.push("t.name = ?");
        params.push(tag);
      }

      if (search) {
        conditions.push(`(MATCH(p.title, p.content, p.category) AGAINST(? IN NATURAL LANGUAGE MODE)
                               OR p.title LIKE ? OR p.content LIKE ? OR p.category LIKE ?)`);
        params.push(search, `%${search}%`, `%${search}%`, `%${search}%`);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      // Build JOIN clause for tag filtering
      const joinClause = tag
        ? `JOIN post_tags pt ON p.id = pt.post_id
                   JOIN tags t ON pt.tag_id = t.id`
        : "";

      // Count total records
      const [countResult] = await database.query(
        `SELECT COUNT(DISTINCT p.id) as total
                 FROM posts p
                 ${joinClause}
                 ${whereClause}`,
        params,
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      // Get posts with tags
      const [posts] = await database.query(
        `SELECT
                    p.*,
                    GROUP_CONCAT(DISTINCT t.name) as tags_list
                 FROM posts p
                 LEFT JOIN post_tags pt ON p.id = pt.post_id
                 LEFT JOIN tags t ON pt.tag_id = t.id
                 ${joinClause}
                 ${whereClause}
                 GROUP BY p.id
                 ORDER BY ${sortBy} ${sortOrder}
                 LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      );

      // Parse tags from comma-separated string to array
      const postsWithTags = posts.map((post) => ({
        ...post,
        tags: post.tags_list ? post.tags_list.split(",") : [],
      }));

      return {
        posts: postsWithTags,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Find post by ID
  static async findById(id) {
    try {
      const [rows] = await database.query(
        `SELECT
                    p.*,
                    GROUP_CONCAT(DISTINCT t.name) as tags_list
                 FROM posts p
                 LEFT JOIN post_tags pt ON p.id = pt.post_id
                 LEFT JOIN tags t ON pt.tag_id = t.id
                 WHERE p.id = ?
                 GROUP BY p.id`,
        [id],
      );

      if (rows.length === 0) {
        return null;
      }

      const post = rows[0];
      post.tags = post.tags_list ? post.tags_list.split(",") : [];

      // Increment view count
      await database.query(
        "UPDATE posts SET view_count = view_count + 1 WHERE id = ?",
        [id],
      );

      return post;
    } catch (error) {
      throw error;
    }
  }

  // Find post by slug
  static async findBySlug(slug) {
    try {
      const [rows] = await database.query(
        `SELECT
                    p.*,
                    GROUP_CONCAT(DISTINCT t.name) as tags_list
                 FROM posts p
                 LEFT JOIN post_tags pt ON p.id = pt.post_id
                 LEFT JOIN tags t ON pt.tag_id = t.id
                 WHERE p.slug = ?
                 GROUP BY p.id`,
        [slug],
      );

      if (rows.length === 0) {
        return null;
      }

      const post = rows[0];
      post.tags = post.tags_list ? post.tags_list.split(",") : [];

      // Increment view count
      await database.query(
        "UPDATE posts SET view_count = view_count + 1 WHERE slug = ?",
        [slug],
      );

      return post;
    } catch (error) {
      throw error;
    }
  }

  // Update post
  static async update(id, updateData) {
    try {
      // Check if post exists
      const existingPost = await this.findById(id);
      if (!existingPost) {
        return null;
      }

      const post = new Post({ ...existingPost, ...updateData });

      // Update post
      await database.query(
        `UPDATE posts
                 SET title = ?, slug = ?, content = ?, excerpt = ?,
                     category = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
        [
          post.title,
          post.slug,
          post.content,
          post.excerpt,
          post.category,
          post.status,
          id,
        ],
      );

      // Handle tags if provided
      if (updateData.tags) {
        // Remove existing tags
        await database.query("DELETE FROM post_tags WHERE post_id = ?", [id]);
        // Add new tags
        await this.handleTags(id, post.tags);
      }

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete post
  static async delete(id) {
    try {
      const [result] = await database.query("DELETE FROM posts WHERE id = ?", [
        id,
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Handle tags (create if not exists, associate with post)
  static async handleTags(postId, tags) {
    try {
      for (const tagName of tags) {
        // Check if tag exists
        const [existingTag] = await database.query(
          "SELECT id FROM tags WHERE name = ?",
          [tagName],
        );

        let tagId;

        if (existingTag.length === 0) {
          // Create new tag
          const slug = tagName.toLowerCase().replace(/\s+/g, "-");
          const [newTag] = await database.query(
            "INSERT INTO tags (name, slug) VALUES (?, ?)",
            [tagName, slug],
          );
          tagId = newTag.insertId;
        } else {
          tagId = existingTag[0].id;
        }

        // Associate tag with post
        await database.query(
          "INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)",
          [postId, tagId],
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // Get post statistics
  static async getStatistics() {
    try {
      const [stats] = await database.query(`
                SELECT
                    COUNT(*) as total_posts,
                    SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_posts,
                    SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_posts,
                    SUM(view_count) as total_views,
                    COUNT(DISTINCT category) as total_categories,
                    (SELECT COUNT(DISTINCT tag_id) FROM post_tags) as total_tags,
                    MAX(created_at) as latest_post_date
                FROM posts
            `);

      const [popularPosts] = await database.query(`
                SELECT id, title, view_count
                FROM posts
                WHERE status = 'published'
                ORDER BY view_count DESC
                LIMIT 5
            `);

      return {
        ...stats[0],
        popular_posts: popularPosts,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Post;
