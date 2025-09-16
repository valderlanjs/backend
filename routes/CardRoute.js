import express from "express";
import { createCard, getCards } from "../controllers/CardController.js";
import upload from "../config/multer.js";

const cardRoute = express.Router();

// Aplica o middleware de upload à rota de criação
cardRoute.post("/", upload.single("image"), createCard);
cardRoute.get("/", getCards);

export default cardRoute;
