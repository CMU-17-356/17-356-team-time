const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const util = require("util");

const app = express();
const PORT = 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // React app's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(bodyParser.json());

// Route to handle calculation
app.post("/calculate", (req, res) => {
  const { expression } = req.body;
  console.log("Received expression:", expression);
  try {
    // Preprocess the expression to handle cases like "2(2)" -> "2*(2)"
    const processedExpression = expression.replace(/(\d)\(/g, "$1*(");
    // Evaluate the expression
    const result = eval(processedExpression); // Use eval carefully; validate input in production
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: "Invalid expression" });
  }
});

// If the file is executed directly, run the server. Otherwise, export app for testing.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} else {
  module.exports = app;
}

// Lambda Function - uses provided documentation https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html
exports.handler = async (event) => {
  console.log("Lambda function executed");

  try {
    const expression = JSON.parse(event.body);
    console.log("Expression received", expression);

    if (typeof expression !== "string") {
      throw new Error("Expression must be a string");
    }

    // Preprocess the expression to handle cases like "2(2)" -> "2*(2)"
    const processedExpression = expression.replace(/(\d)\(/g, "$1*(");

    // Evaluate the expression
    const result = eval(processedExpression); // Use eval carefully; validate input in production

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error("Error processing expression", error);

    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid expression" }),
    };
  }
};
