import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "@utils/apiResponse";
import { ApiError } from "@utils/apiError";
import Update from "@models/update.model";
import fs from "fs"
import path from "path";

export const uploadUpdatedInstaller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { version, description, releaseDate } = req.body;

    if (!version) throw new ApiError(401, "Version number must be provided")
    if (!req.file) throw new ApiError(401, "Installer file missing")

    // NOTE: removed these code temporarily untill I get an paid storage service

    // const filePath = path.join("public/uploads", req.file.filename);
    // const fileBuffer = fs.readFileSync(filePath)
    // const fileName = req.file.filename

    // const { error } = await supabase.storage.from(config.bucket_name).upload(`GesturaInstaller/${fileName}`, fileBuffer, {
    //   contentType: req.file.mimetype,
    //   upsert: true,
    // });

    // fs.unlinkSync(filePath);

    // if (error) throw new ApiError(500, `Error while uploading to supbase: ${error.message}`);

    // const publicUrl = supabase.storage.from(config.bucket_name).getPublicUrl(`GesturaInstaller/${fileName}`).data.publicUrl;

    const publicUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const createdVersion = await Update.create({
      version,
      description,
      releaseDate,
      fileUrl: publicUrl
    });

    res.status(201).json(new ApiResponse("success", createdVersion))
  } catch (error) {
    next(error)
  }
}

export const downloadInstaller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { version } = req.query

    let installer;

    if (!version || version === "latest") {
      installer = await Update.findOne().sort({ releaseDate: -1 })
    } else {
      installer = await Update.findOne({ version })
    }

    if (!installer) throw new ApiError(404, "Installer version not found")

    const absolutePath = path.resolve(installer.fileUrl)

    if (!fs.existsSync(absolutePath)) throw new ApiError(404, "Installer file not found on disk")

    return res.download(absolutePath)
  } catch (error) {
    next(error)
  }
}

export const getLatestVersion = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const installer = await Update.findOne().sort({ releaseDate: -1 })

    if (!installer) throw new ApiError(404, "No latest version found");

    res.status(200).json(new ApiResponse("success", installer))
  } catch (error) {
    next(error)
  }
}
