import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "@utils/apiResponse";
import { ApiError } from "@utils/apiError";
import Update from "@models/update.model";

export const uploadUpdatedInstaller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { version, description, releaseDate } = req.body;

    if (!version) throw new ApiError(400, "Version number must be provided")
    if (!req.file) throw new ApiError(400, "Installer file missing")

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

export const getDownloadURL = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { version } = req.query

    let installer;

    if (!version || version === "latest") {
      installer = await Update.findOne().sort({ releaseDate: -1 })
    } else {
      installer = await Update.findOne({ version }).exec()
    }

    if (!installer) throw new ApiError(404, `No version found for version ${version}`)

    res.status(200).json(new ApiResponse("success", installer))
  } catch (error) {
    next(error)
  }
}

export const getLatestVersion = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const installer = await Update.findOne().sort({ releaseDate: -1 })

    if (!installer) throw new ApiError(404, "No latest version found");

    res.status(200).json(new ApiResponse("success", installer.version))
  } catch (error) {
    next(error)
  }
}
