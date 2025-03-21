import request from "supertest";
import express from "express";
import profileRouter from "../profile";
import dynamoDB from "../../../db/config/dynamodb";
import { v4 as uuidv4 } from "uuid";

// Mock DynamoDB
jest.mock("../../../db/config/dynamodb", () => ({
  put: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  scan: jest.fn().mockReturnThis(),
  promise: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/profiles", profileRouter);

describe("Profile Routes", () => {
  const mockProfile = {
    profileId: uuidv4(),
    userId: uuidv4(),
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    institution: "Test University",
    fieldOfInterest: "Computer Science",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/profiles", () => {
    it("should create a new profile", async () => {
      (dynamoDB.put as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const { profileId, createdAt, updatedAt, ...profileData } = mockProfile;
      const response = await request(app)
        .post("/api/profiles")
        .send(profileData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(profileData);
      expect(response.body.profileId).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dynamoDB.put).toHaveBeenCalledWith({
        TableName: "Profiles",
        Item: expect.objectContaining(profileData),
      });
    });

    it("should handle errors when creating profile", async () => {
      (dynamoDB.put as jest.Mock).mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DB Error")),
      });

      const response = await request(app)
        .post("/api/profiles")
        .send(mockProfile);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/profiles/:profileId", () => {
    it("should get a profile by ID", async () => {
      (dynamoDB.get as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: mockProfile }),
      });

      const response = await request(app).get(
        `/api/profiles/${mockProfile.profileId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProfile);
      expect(dynamoDB.get).toHaveBeenCalledWith({
        TableName: "Profiles",
        Key: { profileId: mockProfile.profileId },
      });
    });

    it("should return 404 when profile not found", async () => {
      (dynamoDB.get as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: null }),
      });

      const response = await request(app).get(
        `/api/profiles/${mockProfile.profileId}`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /api/profiles/:profileId", () => {
    it("should update a profile", async () => {
      const updateData = { firstName: "Jane" };
      (dynamoDB.update as jest.Mock).mockReturnValue({
        promise: jest
          .fn()
          .mockResolvedValue({ Attributes: { ...mockProfile, ...updateData } }),
      });

      const response = await request(app)
        .put(`/api/profiles/${mockProfile.profileId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("Jane");
      expect(dynamoDB.update).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: "Profiles",
          Key: { profileId: mockProfile.profileId },
        }),
      );
    });
  });

  describe("DELETE /api/profiles/:profileId", () => {
    it("should delete a profile", async () => {
      (dynamoDB.delete as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const response = await request(app).delete(
        `/api/profiles/${mockProfile.profileId}`,
      );

      expect(response.status).toBe(204);
      expect(dynamoDB.delete).toHaveBeenCalledWith({
        TableName: "Profiles",
        Key: { profileId: mockProfile.profileId },
      });
    });
  });

  describe("GET /api/profiles", () => {
    it("should get all profiles with pagination", async () => {
      const mockProfiles = [mockProfile];
      (dynamoDB.scan as jest.Mock).mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: mockProfiles }),
      });

      const response = await request(app)
        .get("/api/profiles")
        .query({ limit: "10" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("profiles");
      expect(response.body.profiles).toEqual(mockProfiles);
      expect(dynamoDB.scan).toHaveBeenCalledWith({
        TableName: "Profiles",
        Limit: 10,
      });
    });
  });
});
