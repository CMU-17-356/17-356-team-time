import express, { RequestHandler } from "express";
import dynamoDB from "../db/config/dynamodb";
import { Post, Profile, TableNames } from "../db/schemas";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Dummy posts data
const dummyPosts = [
  {
    postId: uuidv4(),
    userId: "dummy-user-1",
    title: "New Research in Quantum Computing",
    content:
      "Excited to share our latest findings in quantum error correction!",
    tags: ["quantum computing", "research"],
    likeCount: 42,
    createdAt: new Date().toISOString(),
    authorName: "Dr. Sarah Chen",
    authorProfilePicture: "https://i.pravatar.cc/150?img=1",
  },
  {
    postId: uuidv4(),
    userId: "dummy-user-2",
    title: "Machine Learning Breakthrough",
    content:
      "Our team has developed a new approach to neural network optimization.",
    tags: ["machine learning", "AI"],
    likeCount: 28,
    createdAt: new Date().toISOString(),
    authorName: "Prof. James Wilson",
    authorProfilePicture: "https://i.pravatar.cc/150?img=2",
  },
  {
    postId: uuidv4(),
    userId: "dummy-user-3",
    title: "Climate Change Research Update",
    content:
      "New data analysis shows significant changes in global temperature patterns.",
    tags: ["climate science", "environment"],
    likeCount: 15,
    createdAt: new Date().toISOString(),
    authorName: "Dr. Maria Rodriguez",
    authorProfilePicture: "https://i.pravatar.cc/150?img=3",
  },
];

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

    // First get all posts
    const postsParams = {
      TableName: TableNames.POSTS,
      Limit: limit,
      ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey }),
    };

    const postsResult = await dynamoDB.scan(postsParams).promise();

    let posts = postsResult.Items;

    // If no posts exist, use dummy data
    if (!posts || posts.length === 0) {
      posts = dummyPosts;
    }

    // Get author information for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        // For dummy posts, use the included author info
        if (post.authorName) {
          return {
            ...post,
            authorId: post.userId,
            commentCount: 0,
          };
        }

        // For real posts, fetch author info from profiles
        const profileParams = {
          TableName: TableNames.PROFILES,
          Key: { userId: post.userId },
        };

        const profileResult = await dynamoDB.get(profileParams).promise();
        const profile = profileResult.Item as Profile;

        // Generate a random profile picture URL for real posts
        const randomImageId = Math.floor(Math.random() * 70) + 1; // Random number between 1-70
        const profilePicture = `https://i.pravatar.cc/150?img=${randomImageId}`;

        return {
          ...post,
          authorId: post.userId,
          authorName: `${profile.firstName} ${profile.lastName}`,
          authorProfilePicture: profilePicture,
          commentCount: 0,
        };
      }),
    );

    res.json({
      posts: postsWithAuthors,
      lastEvaluatedKey: postsResult.LastEvaluatedKey,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Could not fetch posts" });
  }
}) as RequestHandler);

export default router;
