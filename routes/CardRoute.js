import express from "express";
import {
  createCardGroup,
  getCards,
  deleteCard
} from "../controllers/CardController.js";
import upload from "../middleware/multer.js";

const cardRoute = express.Router();

// Criar 3 cards de uma vez
cardRoute.post("/group", upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
]), createCardGroup);

// Listar todos os cards
cardRoute.get("/", getCards);

// Excluir card individual
cardRoute.delete("/:id", deleteCard);

export default cardRoute;
