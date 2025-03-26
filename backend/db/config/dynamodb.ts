import { DynamoDB } from "aws-sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure AWS SDK
const dynamoDB = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  ...(process.env.NODE_ENV === "development" && {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }),
});

export default dynamoDB;
