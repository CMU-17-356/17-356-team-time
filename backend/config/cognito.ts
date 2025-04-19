import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const initializeCognito =
  async (): Promise<CognitoIdentityProviderClient> => {
    try {
      const cognitoClient = new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
      });

      console.log("Cognito client initialized successfully");
      return cognitoClient;
    } catch (error) {
      console.error("Error initializing Cognito client:", error);
      throw error;
    }
  };

// Constants for Cognito configuration
export const COGNITO_CONFIG = {
  USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || "",
  CLIENT_ID: process.env.COGNITO_CLIENT_ID || "",
  CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET || "", // Add this line
  REGION: process.env.AWS_REGION || "us-east-1",
};

// Helper to generate the secret hash required for Cognito client with secret
export const generateSecretHash = (username: string): string => {
  const message = username + COGNITO_CONFIG.CLIENT_ID;
  const hmac = crypto.createHmac("sha256", COGNITO_CONFIG.CLIENT_SECRET);
  hmac.update(message);
  return hmac.digest("base64");
};
