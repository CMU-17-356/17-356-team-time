// backend/src/index.ts
import AWS from "aws-sdk";
import cors from "cors";
import dotenv from "dotenv";
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import multer from "multer";

dotenv.config();

interface S3UploadParams {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
  ACL?: string;
}

interface CustomError extends Error {
  statusCode?: number;
}

const router = express();
const port = process.env.PORT || 5000;

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const s3 = new AWS.S3();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

// Configure multer for memory storage
const multerStorage = multer.memoryStorage();

const multerFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG files are allowed."));
  }
};

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: multerFileFilter,
});

// Enable CORS
router.use(cors());
router.use(express.json());

// POST - Upload an image
router.post("/:userId", upload.single("image"), (async (
  req: Request,
  res: Response,
) => {
  const { userId } = req.params;
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // const fileExtension = path.extname(file.originalname);
    const fileName = `${userId}/profile.png`;

    const params: S3UploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read' // Uncomment if you want the images to be publicly accessible
    };

    const uploadResult = await s3.upload(params).promise();

    res.status(201).json({
      message: "Image uploaded successfully",
      fileName: fileName,
      url: uploadResult.Location,
    });
  } catch (error) {
    console.error(
      "Error uploading profile image for user:",
      userId,
      ".",
      error,
    );
    res
      .status(500)
      .json({ error: "Could not upload profile image for user: " + error });
  }
}) as RequestHandler);

// GET - Get profile image for a user
router.get("/:userId", (async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const signedUrl = await s3.getSignedUrl("getObject", {
      Bucket: S3_BUCKET_NAME,
      Key: `${userId}/profile.png`,
      Expires: 3600, // URL expires in 1 hour
    });

    res.json({ url: signedUrl });
  } catch (error) {
    console.error("Error getting profile image for user:", userId, error);
    res.status(500).json({ error: "Could not get profile image: " + error });
  }
}) as RequestHandler);

// DELETE - Delete a specific image
router.delete("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const key = `${userId}/profile.png`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ error: "Could not delete profile image: " + error });
  }
});

// PUT - Update an image (replace)
router.put("/:userId", upload.single("image"), (async (
  req: Request,
  res: Response,
) => {
  const { userId } = req.params;
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const key = `${userId}/profile.png`;

    const params: S3UploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read' // Uncomment if you want the images to be publicly accessible
    };

    const uploadResult = await s3.upload(params).promise();

    res.json({
      message: "Image updated successfully",
      fileName: "profile",
      url: uploadResult.Location,
    });
  } catch (error) {
    console.error("Error replacing profile image:", error);
    res.status(500).json({
      error:
        "Could not replace profile image for user: " + userId + ". " + error,
    });
  }
}) as RequestHandler);

// Error handling middleware
router.use(
  (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";
    res.status(statusCode).json({ error: message });
  },
);

router.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default router;
