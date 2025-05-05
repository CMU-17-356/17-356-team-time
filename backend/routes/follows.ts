import express, { RequestHandler } from "express";
import dynamoDB from "../db/config/dynamodb";
import { FollowRelationship, TableNames } from "../db/schemas";

const router = express.Router();

// Follow a user
router.post("/:followingId", (async (req, res) => {
  try {
    const followerId = req.body.followerId;
    const followingId = req.params.followingId;

    if (!followerId) {
      return res.status(400).json({ error: "Follower ID is required" });
    }

    // First check if both profiles exist
    const [followerProfile, followingProfile] = await Promise.all([
      dynamoDB
        .get({
          TableName: TableNames.PROFILES,
          Key: { userId: followerId },
        })
        .promise(),
      dynamoDB
        .get({
          TableName: TableNames.PROFILES,
          Key: { userId: followingId },
        })
        .promise(),
    ]);

    if (!followerProfile.Item) {
      return res.status(404).json({ error: "Follower profile not found" });
    }

    if (!followingProfile.Item) {
      return res.status(404).json({ error: "Following profile not found" });
    }

    // Check if the follow relationship already exists
    const checkParams = {
      TableName: TableNames.FOLLOWS,
      Key: {
        followerId: followerId,
        followingId: followingId,
      },
    };

    const existing = await dynamoDB.get(checkParams).promise();
    if (existing.Item) {
      return res.status(409).json({ error: "Already following this user" });
    }

    // Create the follow relationship
    const follow: FollowRelationship = {
      followerId: followerId,
      followingId: followingId,
      createdAt: new Date().toISOString(),
    };

    const params = {
      TableName: TableNames.FOLLOWS,
      Item: follow,
    };

    await dynamoDB.put(params).promise();

    // Update follower's following count
    const updateFollowerParams = {
      TableName: TableNames.PROFILES,
      Key: { userId: followerId },
      UpdateExpression:
        "SET following = if_not_exists(following, :zero) + :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
        ":zero": 0,
      },
      ReturnValues: "ALL_NEW",
    };

    // Update following user's followers count
    const updateFollowingParams = {
      TableName: TableNames.PROFILES,
      Key: { userId: followingId },
      UpdateExpression:
        "SET followers = if_not_exists(followers, :zero) + :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
        ":zero": 0,
      },
      ReturnValues: "ALL_NEW",
    };

    await Promise.all([
      dynamoDB.update(updateFollowerParams).promise(),
      dynamoDB.update(updateFollowingParams).promise(),
    ]);

    res.status(201).json(follow);
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: "Could not follow user: " + error });
  }
}) as RequestHandler);

// Unfollow a user
router.delete("/:followingId", (async (req, res) => {
  try {
    const followerId = req.body.followerId;
    const followingId = req.params.followingId;

    if (!followerId) {
      return res.status(400).json({ error: "Follower ID is required" });
    }

    // First check if both profiles exist
    const [followerProfile, followingProfile] = await Promise.all([
      dynamoDB
        .get({
          TableName: TableNames.PROFILES,
          Key: { userId: followerId },
        })
        .promise(),
      dynamoDB
        .get({
          TableName: TableNames.PROFILES,
          Key: { userId: followingId },
        })
        .promise(),
    ]);

    if (!followerProfile.Item) {
      return res.status(404).json({ error: "Follower profile not found" });
    }

    if (!followingProfile.Item) {
      return res.status(404).json({ error: "Following profile not found" });
    }

    // Delete the follow relationship
    const deleteParams = {
      TableName: TableNames.FOLLOWS,
      Key: {
        followerId: followerId,
        followingId: followingId,
      },
    };

    await dynamoDB.delete(deleteParams).promise();

    // Update follower's following count
    const updateFollowerParams = {
      TableName: TableNames.PROFILES,
      Key: { userId: followerId },
      UpdateExpression:
        "SET following = if_not_exists(following, :zero) - :dec",
      ExpressionAttributeValues: {
        ":dec": 1,
        ":zero": 0,
      },
      ReturnValues: "ALL_NEW",
    };

    // Update following user's followers count
    const updateFollowingParams = {
      TableName: TableNames.PROFILES,
      Key: { userId: followingId },
      UpdateExpression:
        "SET followers = if_not_exists(followers, :zero) - :dec",
      ExpressionAttributeValues: {
        ":dec": 1,
        ":zero": 0,
      },
      ReturnValues: "ALL_NEW",
    };

    await Promise.all([
      dynamoDB.update(updateFollowerParams).promise(),
      dynamoDB.update(updateFollowingParams).promise(),
    ]);

    res.status(204).send();
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: "Could not unfollow user: " + error });
  }
}) as RequestHandler);

// Check if a user is following another user
router.get("/:followingId/status", (async (req, res) => {
  try {
    const followerId = req.query.followerId as string;
    const followingId = req.params.followingId;

    if (!followerId) {
      return res.status(400).json({ error: "Follower ID is required" });
    }

    // First check if both profiles exist
    const [followerProfile, followingProfile] = await Promise.all([
      dynamoDB
        .get({
          TableName: TableNames.PROFILES,
          Key: { userId: followerId },
        })
        .promise(),
      dynamoDB
        .get({
          TableName: TableNames.PROFILES,
          Key: { userId: followingId },
        })
        .promise(),
    ]);

    if (!followerProfile.Item) {
      return res.status(404).json({ error: "Follower profile not found" });
    }

    if (!followingProfile.Item) {
      return res.status(404).json({ error: "Following profile not found" });
    }

    const params = {
      TableName: TableNames.FOLLOWS,
      Key: {
        followerId: followerId,
        followingId: followingId,
      },
    };

    const result = await dynamoDB.get(params).promise();
    res.json({ isFollowing: !!result.Item });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ error: "Could not check follow status: " + error });
  }
}) as RequestHandler);

// Get followers count for a user
router.get("/:userId/followers/count", (async (req, res) => {
  try {
    const userId = req.params.userId;

    const params = {
      TableName: TableNames.PROFILES,
      Key: { userId: userId },
      ProjectionExpression: "followers",
    };

    const result = await dynamoDB.get(params).promise();
    res.json({ followers: result.Item?.followers || 0 });
  } catch (error) {
    console.error("Error getting followers count:", error);
    res.status(500).json({ error: "Could not get followers count: " + error });
  }
}) as RequestHandler);

// Get following count for a user
router.get("/:userId/following/count", (async (req, res) => {
  try {
    const userId = req.params.userId;

    const params = {
      TableName: TableNames.PROFILES,
      Key: { userId: userId },
      ProjectionExpression: "following",
    };

    const result = await dynamoDB.get(params).promise();
    res.json({ following: result.Item?.following || 0 });
  } catch (error) {
    console.error("Error getting following count:", error);
    res.status(500).json({ error: "Could not get following count: " + error });
  }
}) as RequestHandler);

export default router;
