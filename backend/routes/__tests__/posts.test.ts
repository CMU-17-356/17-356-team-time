import express from "express";
import { beforeEach } from "node:test";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import dynamoDB from "../../db/config/dynamodb";
import postsRouter from "../posts";

// Mock DynamoDB
jest.mock("../../db/config/dynamodb", () => ({
  put: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  scan: jest.fn().mockReturnThis(),
  promise: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/posts", postsRouter);

describe("Posts Routes", () => {
  const mockPost = {
    postId: uuidv4(),
    userId: uuidv4(),
    title: "Test Post",
    content: "This is a test post content",
    tags: ["test", "example"],
    likeCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("POST /api/posts", () => {
    it("should create a new post", async () => {
      (dynamoDB.put as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const { postId, createdAt, updatedAt, ...postData } = mockPost;
      const response = await request(app).post("/api/posts").send(postData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(postData);
      expect(response.body.postId).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dynamoDB.put).toHaveBeenCalledWith({
        TableName: "Posts",
        Item: expect.objectContaining(postData),
      });
    });

    it("should handle errors when creating post", async () => {
      (dynamoDB.put as jest.Mock).mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DB Error")),
      });

      const response = await request(app).post("/api/posts").send(mockPost);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/posts/:postId", () => {
    it("should get a post by ID", async () => {
      (dynamoDB.get as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: mockPost }),
      });

      const response = await request(app).get(`/api/posts/${mockPost.postId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPost);
      expect(dynamoDB.get).toHaveBeenCalledWith({
        TableName: "Posts",
        Key: { postId: mockPost.postId },
      });
    });

    it("should return 404 when post not found", async () => {
      (dynamoDB.get as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: null }),
      });

      const response = await request(app).get(`/api/posts/${mockPost.postId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/posts", () => {
    it("should get all posts with pagination", async () => {
      const mockPosts = [mockPost];
      (dynamoDB.scan as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Items: mockPosts,
          LastEvaluatedKey: null,
        }),
      });

      const response = await request(app)
        .get("/api/posts")
        .query({ limit: "10" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("posts");
      expect(response.body.posts).toEqual(mockPosts);
      expect(dynamoDB.scan).toHaveBeenCalledWith({
        TableName: "Posts",
        Limit: 10,
      });
    });
  });
});
