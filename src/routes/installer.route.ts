import { getDownloadURL, getLatestVersion, uploadUpdatedInstaller } from "@controllers/installer.controller"
import upload from "@middlewares/multer.middleware"
import { Router } from "express"

const router = Router()

router.route("/version").get(getLatestVersion)
router.route("/upload").post(upload.single("installer"), uploadUpdatedInstaller)
router.route("/download").get(getDownloadURL)

export default router;
