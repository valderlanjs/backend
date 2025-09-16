// controllers/cardController.js
import Card from "../models/CardModel.js";

// Criar card
import Card from "../models/CardModel.js";
import { v2 as cloudinary } from "cloudinary";

// Criar card com upload de imagem
export const createCard = async (req, res) => {
  try {
    const { title, subtitle, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Imagem é obrigatória." });
    }

    // Upload da imagem para o Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "cards" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Erro ao enviar imagem." });
        }

        // Cria o card com a URL da imagem
        const card = await Card.create({
          title,
          subtitle,
          link,
          image: result.secure_url,
        });

        res.status(201).json({ success: true, card });
      }
    );

    // Envia o buffer da imagem
    result.end(req.file.buffer);

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
