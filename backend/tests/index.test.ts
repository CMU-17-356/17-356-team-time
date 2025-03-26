import fs from "fs";
import { jest } from "@jest/globals";

// Mock the fs module
jest.mock("fs");

// Mock console.log
jest.spyOn(process.stdout, "write").mockImplementation(() => true);

describe("Logging functionality", () => {
  let logFileWriteMock: jest.Mock;

  beforeAll(() => {
    // Create a mock for the write stream
    logFileWriteMock = jest.fn();
    (fs.createWriteStream as jest.Mock).mockReturnValue({
      write: logFileWriteMock,
    });

    // Import the index file to ensure logging setup runs
    require("../index");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Add your test cases here
  it("should be properly configured", () => {
    expect(fs.createWriteStream).toHaveBeenCalled();
  });
});
