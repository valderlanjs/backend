import express from "express";
import { createCardGroup, getCards } from "../controllers/CardController.js";
import upload from "../middleware/multer.js";

const cardRoute = express.Router();

// Rota para criar 3 cards de uma vez
cardRoute.post("/group", upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
]), createCardGroup);

// Rota para listar todos os cards
cardRoute.get("/", getCards);

export default cardRoute;
