import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

let mongo: MongoMemoryServer;

beforeAll(async (): Promise<void> => {
  try {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  } catch (error) {
    throw new Error(`error while creating mongo memory server: ${error}`)
  }
})

afterAll(async (): Promise<void> => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  } catch (error) {
    throw new Error(`error while deleting database: ${error}`)
  }
})

afterEach(async (): Promise<void> => {
  try {
    const uploadsDir = path.resolve("public/uploads");
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        fs.unlinkSync(path.join(uploadsDir, file));
      }
    }

    const collections = await mongoose.connection.db?.collections()

    if (!collections) throw new Error("Collection doesn't exists")

    for (let collection of collections) {
      await collection.deleteMany({})
    }
  } catch (error) {
    throw new Error(`error while deleting collection: ${error}`)
  }
});
