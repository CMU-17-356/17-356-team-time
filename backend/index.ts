import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import postsRouter from "./routes/posts";
import profileRouter from "./routes/profile";
import profileImageRouter from "./routes/profilesImages";

const app: Express = express();
const PORT: number = 5001;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(bodyParser.json());

// Mount profile routes
app.use("/api/profiles", profileRouter);
// Mount posts routes
app.use("/api/posts", postsRouter);
// Mount profile image routes
app.use("/api/imgs", profileImageRouter);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
