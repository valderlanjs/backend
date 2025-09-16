// controllers/cardController.js
import Card from "../models/CardModel.js";

// Criar card
export const createCard = async (req, res) => {
  try {
    const { title, subtitle, link, image } = req.body;
    const card = await Card.create({ title, subtitle, link, image });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar cards
export const getCards = async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
