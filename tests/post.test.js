// tests/posts.test.js
const request = require("supertest");
const app = require("../server");
const database = require("../config/database");

describe("Blogging Platform API", () => {
  beforeAll(async () => {
    // Connect to test database
    await database.connect();
  });

  afterAll(async () => {
    // Clean up and disconnect
    await database.disconnect();
  });

  describe("POST /api/v1/posts", () => {
    it("should create a new blog post", async () => {
      const postData = {
        title: "Test Blog Post",
        content: "This is a test blog post content.",
        category: "Testing",
        tags: ["test", "blog"],
        status: "published",
      };

      const response = await request(app)
        .post("/api/v1/posts")
        .send(postData)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Post created successfully");
      expect(response.body.post.title).toBe(postData.title);
      expect(response.body.post.content).toBe(postData.content);
      expect(response.body.post.category).toBe(postData.category);
      expect(response.body.post.tags).toEqual(postData.tags);
      expect(response.body.post.status).toBe(postData.status);
    });

    it("should return 400 for invalid data", async () => {
      const invalidData = {
        title: "AB", // Too short
        content: "Short", // Too short
      };

      const response = await request(app)
        .post("/api/v1/posts")
        .send(invalidData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.status).toBe("error");
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/v1/posts", () => {
    it("should get all blog posts", async () => {
      const response = await request(app)
        .get("/api/v1/posts")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it("should filter posts by category", async () => {
      const response = await request(app)
        .get("/api/v1/posts?category=Testing")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(
        response.body.posts.every((post) => post.category === "Testing"),
      ).toBe(true);
    });

    it("should search posts", async () => {
      const response = await request(app)
        .get("/api/v1/posts/search?q=test")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.results).toBeDefined();
    });
  });

  describe("GET /api/v1/posts/:id", () => {
    let postId;

    beforeEach(async () => {
      // Create a post to test retrieval
      const postData = {
        title: "Test Post for Retrieval",
        content: "Content for retrieval test",
        category: "Testing",
      };

      const response = await request(app).post("/api/v1/posts").send(postData);

      postId = response.body.post.id;
    });

    it("should get a single blog post by ID", async () => {
      const response = await request(app)
        .get(`/api/v1/posts/${postId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.post.id).toBe(postId);
    });

    it("should return 404 for non-existent post", async () => {
      const response = await request(app)
        .get("/api/v1/posts/999999")
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body.status).toBe("error");
    });
  });

  describe("PUT /api/v1/posts/:id", () => {
    let postId;

    beforeEach(async () => {
      const postData = {
        title: "Post to Update",
        content: "Content to update",
        category: "Testing",
      };

      const response = await request(app).post("/api/v1/posts").send(postData);

      postId = response.body.post.id;
    });

    it("should update a blog post", async () => {
      const updateData = {
        title: "Updated Post Title",
        content: "Updated content",
        category: "Updated Category",
        tags: ["updated", "test"],
      };

      const response = await request(app)
        .put(`/api/v1/posts/${postId}`)
        .send(updateData)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.post.title).toBe(updateData.title);
      expect(response.body.post.category).toBe(updateData.category);
    });
  });

  describe("DELETE /api/v1/posts/:id", () => {
    let postId;

    beforeEach(async () => {
      const postData = {
        title: "Post to Delete",
        content: "Content to delete",
        category: "Testing",
      };

      const response = await request(app).post("/api/v1/posts").send(postData);

      postId = response.body.post.id;
    });

    it("should delete a blog post", async () => {
      await request(app).delete(`/api/v1/posts/${postId}`).expect(204);

      // Verify post is deleted
      await request(app).get(`/api/v1/posts/${postId}`).expect(404);
    });
  });
});
