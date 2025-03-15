// jest.config.js
module.exports = {
  // Use the Node environment for backend testing.
  testEnvironment: "node",
  // Look for test files in __tests__ folders or files ending with .test.js or .spec.js
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.js$",
  // Optional: Specify module file extensions for imports
  moduleFileExtensions: ["js", "json", "node"],
};
