import express, { RequestHandler } from "express";
import {
  SignUpCommand,
  InitiateAuthCommand,
  CognitoIdentityProviderClient,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { COGNITO_CONFIG } from "../config/cognito";
import dynamoDB from "../db/config/dynamodb";
import { Profile, TableNames } from "../db/schemas";

const router = express.Router();

// Sign up a new user
router.post("/signup", (async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const client = req.app.locals
      .cognitoClient as CognitoIdentityProviderClient;

    const command = new SignUpCommand({
      ClientId: COGNITO_CONFIG.CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "given_name", Value: firstName },
        { Name: "family_name", Value: lastName },
      ],
    });

    const response = await client.send(command);

    // Create a profile in DynamoDB immediately (since we're not verifying email)
    const profile: Profile = {
      userId: response.UserSub as string,
      firstName: firstName,
      lastName: lastName,
      email: email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const params = {
      TableName: TableNames.PROFILES,
      Item: profile,
    };

    await dynamoDB.put(params).promise();

    res.status(201).json({
      message: "Registration successful!",
      userSub: response.UserSub,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Could not register user: " + error });
  }
}) as RequestHandler);

// Sign in a user
router.post("/signin", (async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const client = req.app.locals
      .cognitoClient as CognitoIdentityProviderClient;

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: COGNITO_CONFIG.CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    const response = await client.send(command);

    // Store user info in session
    if (req.session) {
      req.session.userInfo = {
        username: username,
        accessToken: response.AuthenticationResult?.AccessToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
        idToken: response.AuthenticationResult?.IdToken,
      };
    }

    res.status(200).json({
      message: "Login successful",
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
    });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(401).json({ error: "Invalid username or password" });
  }
}) as RequestHandler);

// Sign out a user
router.post("/signout", (async (req, res) => {
  try {
    // Clear session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Could not sign out" });
        }

        res.status(200).json({ message: "Successfully signed out" });
      });
    } else {
      res.status(200).json({ message: "Already signed out" });
    }
  } catch (error) {
    console.error("Error signing out:", error);
    res.status(500).json({ error: "Could not sign out: " + error });
  }
}) as RequestHandler);

export default router;
