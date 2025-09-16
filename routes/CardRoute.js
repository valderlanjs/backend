// routes/cardRoutes.js
import express from "express";
import { createCard, getCards } from "../controllers/CardController.js";

const cardRoute = express.Router();

cardRoute.post("/", createCard);
cardRoute.get("/", getCards);

export default cardRoute;
