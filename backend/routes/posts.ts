import express, { RequestHandler } from "express";
import dynamoDB from "../db/config/dynamodb";
import { Post, TableNames } from "../db/schemas";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Create a new post
router.post("/", (async (req, res) => {
  try {
    const post: Post = {
      postId: uuidv4(), // Generate a unique ID for the post
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags || [],
      likeCount: req.body.likeCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const params = {
      TableName: TableNames.POSTS,
      Item: post,
    };

    await dynamoDB.put(params).promise();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Could not create post: " + error });
  }
}) as RequestHandler);

// Get a post by postId
router.get("/:postId", (async (req, res) => {
  try {
    const params = {
      TableName: TableNames.POSTS,
      Key: {
        postId: req.params.postId,
      },
    };

    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result.Item);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      error: `Could not fetch post with id: ${req.params.postId}. ${error}`,
    });
  }
}) as RequestHandler);

// Get all posts in db
router.get("/", (async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const lastEvaluatedKey = req.query.lastEvaluatedKey
      ? JSON.parse(req.query.lastEvaluatedKey as string)
      : undefined;

    const params = {
      TableName: TableNames.POSTS,
      Limit: limit,
      ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey }),
    };

    const result = await dynamoDB.scan(params).promise();

    res.json({
      posts: result.Items,
      lastEvaluatedKey: result.LastEvaluatedKey,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Could not fetch posts" });
  }
}) as RequestHandler);

export default router;
