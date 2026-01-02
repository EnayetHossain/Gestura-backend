import { downloadInstaller, getLatestVersion, uploadUpdatedInstaller } from "@controllers/installer.controller"
import upload from "@middlewares/multer.middleware"
import { Router } from "express"

const router = Router()

router.route("/").get(getLatestVersion)
router.route("/upload").post(upload.single("installer"), uploadUpdatedInstaller)
router.route("/download").get(downloadInstaller)

export default router;
