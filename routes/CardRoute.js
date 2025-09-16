import express from "express";
import {
  createCardGroup,
  getCards,
  deleteCard,
  updateSectionTitle
} from "../controllers/CardController.js";
import upload from "../middleware/multer.js";

const cardRoute = express.Router();

cardRoute.post("/group", upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
]), createCardGroup);

cardRoute.get("/", getCards);
cardRoute.delete("/:id", deleteCard);

// ✅ Nova rota para atualizar título
cardRoute.post("/title", updateSectionTitle);

export default cardRoute;
