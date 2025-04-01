import dynamoDB from "./config/dynamodb";
import { v4 as uuidv4 } from "uuid";
import { User, Profile, TableNames } from "./schemas";

async function addDummyUser(): Promise<string> {
  const userId = uuidv4();

  const user: User = {
    userId: userId,
    firstName: "Daniel",
    lastName: "Sung",
    email: "Daniel@cmu.com",
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: TableNames.USERS,
    Item: user,
  };

  await dynamoDB.put(params).promise();
  console.log("Added dummy user:", user);
  return userId;
}

async function addDummyProfile(userId: string): Promise<void> {
  const profile: Profile = {
    userId: userId,
    firstName: "Daniel",
    lastName: "Sung",
    email: "Daniel@cmu.com",
    institution: "Carnegie Mellon University",
    fieldOfInterest: "Machine Learning",
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: TableNames.PROFILES,
    Item: profile,
  };

  await dynamoDB.put(params).promise();
  console.log("Added dummy profile:", profile);
}

// Create a dummy user and profile
async function createDummyData(): Promise<void> {
  try {
    const userId = await addDummyUser();
    await addDummyProfile(userId);
    console.log("Successfully added dummy data");
  } catch (error) {
    console.error("Error adding dummy data:", error);
  }
}

// Run the function
createDummyData();
