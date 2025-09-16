// routes/cardRoutes.js
import express from "express";
import { createCard, getCards } from "../controllers/CardController.js";

const cardRoute = express.Router();

router.post("/", createCard);
router.get("/", getCards);

export default cardRoute;
