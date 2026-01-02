jest.setTimeout(20000);

import path from "path"
import express from "express"
import request from "supertest"
import uploadRoutes from "../src/routes/installer.route"
import { errorHandler } from "../src/middlewares/errorHandler.middleware";

jest.mock("@utils/supabaseClient", () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://supabase.com/test.exe" } }),
      }),
    },
  },
}));


const app = express();
app.use(express.json({ limit: "160kb" }));
app.use(express.urlencoded({ extended: true, limit: "160kb" }));
app.use('/api/v1/installer', uploadRoutes);
app.use(errorHandler);

describe("POST /api/v1/installer/upload", (): void => {
  it("Should upload the installer and create a database entry", async (): Promise<void> => {

    const filePath = path.join(__dirname, "../public/testInstaller/TouchpadInstaller.exe")
    const res = await request(app).post("/api/v1/installer/upload")
      .field("version", "1.0.0")
      .field("description", "test update upload")
      .field("releaseDate", new Date().toISOString())
      .attach("installer", filePath)

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("success");
    expect(res.body.data.fileUrl).toMatch(/^https:\/\/.*supabase.*/);
  });

  it("Should fail if version is missing", async (): Promise<void> => {
    const filePath = path.join(__dirname, "../public/testInstaller/TouchpadInstaller.exe")
    const res = await request(app).post("/api/v1/installer/upload")
      .field("description", "test update upload")
      .field("releaseDate", new Date().toISOString())
      .attach("installer", filePath)

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/version/i);
  })

  it("Should fail if the installer file is missing", async (): Promise<void> => {
    const res = await request(app).post("/api/v1/installer/upload")
      .field("version", "1.0.0")
      .field("description", "test update upload")
      .field("releaseDate", new Date().toISOString())

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/installer/i);
  })
})
