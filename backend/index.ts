import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import session from "express-session";
import { initializeCognito } from "./config/cognito";
import authRouter from "./routes/auth";
import postsRouter from "./routes/posts";
import profileRouter from "./routes/profile";
import profileImageRouter from "./routes/profilesImages";
import { COGNITO_CONFIG } from "./config/cognito";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import followsRoutes from "./routes/follows";

dotenv.config();

const app: Express = express();
const PORT: number = 5001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // important for sessions!
  }),
);
app.use(bodyParser.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret", // default for dev
    resave: false,
    saveUninitialized: false,
  }),
);

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: COGNITO_CONFIG.REGION,
});

// Store Cognito client in app.locals for use in routes
app.locals.cognitoClient = cognitoClient;

// Middleware to check authentication
app.use(
  (
    req: Request & { session: any; isAuthenticated?: boolean },
    res: Response,
    next: NextFunction,
  ) => {
    req.isAuthenticated = !!req.session.userInfo;
    next();
  },
);

// Mount routes
app.use("/api/profiles", profileRouter);
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/imgs", profileImageRouter);
app.use("/api/follows", followsRoutes);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
