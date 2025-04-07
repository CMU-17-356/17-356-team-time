import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import profileRouter from "./routes/profile";
import postsRouter from "./routes/posts";

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

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
