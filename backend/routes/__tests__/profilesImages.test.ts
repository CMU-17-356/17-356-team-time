// backend/src/__tests__/index.test.ts
import AWS from "aws-sdk";
import express from "express";
import request from "supertest";
import router from "../profilesImages";

// Mock AWS S3
jest.mock("aws-sdk", () => {
  const mockS3Instance = {
    upload: jest.fn().mockReturnThis(),
    deleteObject: jest.fn().mockReturnThis(),
    getSignedUrl: jest.fn(),
    promise: jest.fn(),
  };
  return {
    S3: jest.fn(() => mockS3Instance),
    config: {
      update: jest.fn(),
    },
  };
});

// Mock environment variables
process.env.S3_BUCKET_NAME = "reach-profiles";
process.env.S3_ACCESS_KEY = "test-access-key";
process.env.S3_SECRET_KEY = "test-secret-key";
process.env.AWS_REGION = "us-east-1";

describe("Profile Image API", () => {
  let app: express.Application;
  let mockS3: any;

  beforeEach(() => {
    app = express();
    app.use(router);
    mockS3 = new AWS.S3();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /:userId", () => {
    it("should return a signed URL for a user profile image", async () => {
      // Setup mock
      const mockSignedUrl =
        "https://reach-profiles.s3.amazonaws.com/123/profile.png?signed=abc";
      mockS3.getSignedUrl.mockReturnValue(mockSignedUrl);

      // Execute request
      const response = await request(app).get("/123");

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ url: mockSignedUrl });
      expect(mockS3.getSignedUrl).toHaveBeenCalled();
    });

    it("should return 500 if S3 getSignedUrl fails", async () => {
      // Setup mock to throw error
      mockS3.getSignedUrl.mockImplementation(() => {
        throw new Error("S3 error");
      });

      // Execute request
      const response = await request(app).get("/123");

      // Assert response
      expect(response.status).toBe(500);
      expect(response.body.error).toContain("Could not get profile image");
    });
  });

  describe("POST /:userId", () => {
    it("should upload a new profile image", async () => {
      // Setup mock
      const mockUploadResult = {
        Location: "https://reach-profiles.s3.amazonaws.com/123/profile.png",
      };
      mockS3.promise.mockResolvedValue(mockUploadResult);

      // Execute request with image
      const response = await request(app)
        .post("/123")
        .attach("image", Buffer.from("fake-image-content"), {
          filename: "test.png",
          contentType: "image/png",
        });

      // Assert response
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "Image uploaded successfully",
        fileName: "123/profile.png",
        url: mockUploadResult.Location,
      });
      expect(mockS3.upload).toHaveBeenCalled();
    });

    it("should return 400 if no file is uploaded", async () => {
      // Execute request without image
      const response = await request(app).post("/123");

      // Assert response
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("No file uploaded");
    });

    it("should return 500 if S3 upload fails", async () => {
      // Setup mock to throw error
      mockS3.promise.mockRejectedValue(new Error("S3 upload error"));

      // Execute request with image
      const response = await request(app)
        .post("/123")
        .attach("image", Buffer.from("fake-image-content"), {
          filename: "test.png",
          contentType: "image/png",
        });

      // Assert response
      expect(response.status).toBe(500);
      expect(response.body.error).toContain("Could not upload profile image");
    });
  });

  describe("PUT /:userId", () => {
    it("should update an existing profile image", async () => {
      // Setup mock
      const mockUploadResult = {
        Location: "https://reach-profiles.s3.amazonaws.com/123/profile.png",
      };
      mockS3.promise.mockResolvedValue(mockUploadResult);

      // Execute request with image
      const response = await request(app)
        .put("/123")
        .attach("image", Buffer.from("updated-image-content"), {
          filename: "updated.png",
          contentType: "image/png",
        });

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Image updated successfully",
        fileName: "profile",
        url: mockUploadResult.Location,
      });
      expect(mockS3.upload).toHaveBeenCalled();
    });

    it("should return 400 if no file is uploaded", async () => {
      // Execute request without image
      const response = await request(app).put("/123");

      // Assert response
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("No file uploaded");
    });

    it("should return 500 if S3 upload fails during update", async () => {
      // Setup mock to throw error
      mockS3.promise.mockRejectedValue(new Error("S3 update error"));

      // Execute request with image
      const response = await request(app)
        .put("/123")
        .attach("image", Buffer.from("updated-image-content"), {
          filename: "updated.png",
          contentType: "image/png",
        });

      // Assert response
      expect(response.status).toBe(500);
      expect(response.body.error).toContain("Could not replace profile image");
    });
  });

  describe("DELETE /:userId", () => {
    it("should delete a profile image", async () => {
      // Setup mock
      mockS3.promise.mockResolvedValue({});

      // Execute request
      const response = await request(app).delete("/123");

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Image deleted successfully" });
      expect(mockS3.deleteObject).toHaveBeenCalled();
    });

    it("should return 500 if S3 delete fails", async () => {
      // Setup mock to throw error
      mockS3.promise.mockRejectedValue(new Error("S3 delete error"));

      // Execute request
      const response = await request(app).delete("/123");

      // Assert response
      expect(response.status).toBe(500);
      expect(response.body.error).toContain("Could not delete profile image");
    });
  });

  describe("File validation", () => {
    it("should reject non-image files", async () => {
      const response = await request(app)
        .post("/123")
        .attach("image", Buffer.from("fake-text-content"), {
          filename: "test.txt",
          contentType: "text/plain",
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain("Invalid file type");
    });
  });
});
