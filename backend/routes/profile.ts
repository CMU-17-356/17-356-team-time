import express, { RequestHandler } from "express";
import dynamoDB from "../db/config/dynamodb";
import { Profile, TableNames } from "../db/schemas";

const router = express.Router();

// Create a new profile
router.post("/", (async (req, res) => {
  try {
    const profile: Profile = {
      userId: req.body.userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      institution: req.body.institution,
      fieldOfInterest: req.body.fieldOfInterest,
      bio: req.body.bio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      following: 0, // Initialize following count
      followers: 0, // Initialize followers count
    };

    const params = {
      TableName: TableNames.PROFILES,
      Item: profile,
    };

    await dynamoDB.put(params).promise();
    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Could not create profile: " + error });
  }
}) as RequestHandler);

// Get a profile by userId
router.get("/:userId", (async (req, res) => {
  try {
    const params = {
      TableName: TableNames.PROFILES,
      Key: {
        userId: req.params.userId,
      },
    };

    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(result.Item);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      error: `Could not fetch profile with id: ${req.params.userId}. ${error}`,
    });
  }
}) as RequestHandler);

// Update a profile
router.put("/:userId", (async (req, res) => {
  try {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    // Build update expression dynamically based on provided fields
    Object.entries(req.body).forEach(([key, value]) => {
      if (value !== undefined) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    // Always update the updatedAt timestamp
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    const params = {
      TableName: TableNames.PROFILES,
      Key: {
        userId: req.params.userId,
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDB.update(params).promise();

    if (!result.Attributes) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(result.Attributes);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      error: `Could not update profile: ${req.params.userId} + ${error}`,
    });
  }
}) as RequestHandler);

// Delete a profile
router.delete("/:userId", (async (req, res) => {
  try {
    const params = {
      TableName: TableNames.PROFILES,
      Key: {
        userId: req.params.userId,
      },
    };

    await dynamoDB.delete(params).promise();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({
      error: `Could not delete profile: ${req.params.userId} + ${error}`,
    });
  }
}) as RequestHandler);

// Get all profiles (with optional pagination)
router.get("/", (async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const lastEvaluatedKey = req.query.lastEvaluatedKey
      ? JSON.parse(req.query.lastEvaluatedKey as string)
      : undefined;

    const params = {
      TableName: TableNames.PROFILES,
      Limit: limit,
      ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey }),
    };

    const result = await dynamoDB.scan(params).promise();

    res.json({
      profiles: result.Items,
      lastEvaluatedKey: result.LastEvaluatedKey,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Could not fetch profiles" });
  }
}) as RequestHandler);

export default router;
