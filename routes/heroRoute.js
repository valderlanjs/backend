import express from "express";
import {
  getHeroImages,
  addHeroImage,
  deleteHero,
  addHero,
} from "../controllers/heroController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const heroRouter = express.Router();

heroRouter.get("/image", getHeroImages);

heroRouter.post(
  "/update",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addHeroImage
);

heroRouter.delete("/:id", adminAuth, deleteHero);

heroRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addHero
);

export default heroRouter;
