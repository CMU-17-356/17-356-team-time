import express, { RequestHandler } from "express";
import {
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  CognitoIdentityProviderClient,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { COGNITO_CONFIG, generateSecretHash } from "../config/cognito";
import dynamoDB from "../db/config/dynamodb";
import { Profile, TableNames } from "../db/schemas";

const router = express.Router();

// Sign up a new user
router.post("/signup", (async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      phone,
      institution,
      fieldOfInterest,
      bio,
    } = req.body;
    // Note: The frontend sends 'username' but it's actually the userId

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const client = req.app.locals
      .cognitoClient as CognitoIdentityProviderClient;
    const secretHash = generateSecretHash(username);

    try {
      const command = new SignUpCommand({
        ClientId: COGNITO_CONFIG.CLIENT_ID,
        Username: username, // This is the userId from the frontend
        Password: password,
        SecretHash: secretHash, // Add this line
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "given_name", Value: firstName },
          { Name: "family_name", Value: lastName },
        ],
      });

      const response = await client.send(command);

      // Create a profile in DynamoDB using the userId as the primary key
      const profile: Profile = {
        userId: username, // Use the same userId here
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        institution: institution,
        fieldOfInterest: fieldOfInterest,
        bio: bio,
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
        userId: username,
      });
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        return res.status(409).json({ error: "User ID already exists" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Could not register user: " + error });
  }
}) as RequestHandler);

// Sign in a user
router.post("/signin", (async (req, res) => {
  try {
    const { username, password } = req.body;
    // Note: The frontend sends 'username' but it's actually the userId

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "User ID and password are required" });
    }

    const client = req.app.locals
      .cognitoClient as CognitoIdentityProviderClient;
    const secretHash = generateSecretHash(username);

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: COGNITO_CONFIG.CLIENT_ID,
      AuthParameters: {
        USERNAME: username, // This is the userId from the frontend
        PASSWORD: password,
        SECRET_HASH: secretHash, // Add this line
      },
    });

    const response = await client.send(command);

    // Store user info in session
    if (req.session) {
      req.session.userInfo = {
        userId: username,
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
    res.status(401).json({ error: "Invalid User ID or password" });
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

router.post("/confirm", (async (req, res) => {
  try {
    const { username, code } = req.body;

    if (!username || !code) {
      return res
        .status(400)
        .json({ error: "Username and confirmation code are required" });
    }

    const client = req.app.locals
      .cognitoClient as CognitoIdentityProviderClient;
    const secretHash = generateSecretHash(username);

    const command = new ConfirmSignUpCommand({
      ClientId: COGNITO_CONFIG.CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
      SecretHash: secretHash,
    });

    await client.send(command);

    res.status(200).json({
      message: "Account confirmed successfully! You can now sign in.",
    });
  } catch (error: any) {
    console.error("Error confirming user:", error);

    if (error.name === "CodeMismatchException") {
      return res.status(400).json({ error: "Invalid verification code" });
    } else if (error.name === "ExpiredCodeException") {
      return res.status(400).json({ error: "Verification code has expired" });
    }

    res.status(500).json({ error: "Could not confirm account: " + error });
  }
}) as RequestHandler);

export default router;
