/*import { v2 as cloudinary } from "cloudinary";
import Hero from "../models/heroModel.js";

const getHeroImage = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    if (!hero) {
      return res.json({ success: false, message: "Imagem do home não encontrada." });
    }
    res.json({ success: true, hero });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao obter a imagem do home." });
  }
};

const updateHeroImage = async (req, res) => {
  try {
    const image = req.files.image && req.files.image[0];
    const imageUrl = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ imageUrl: imageUrl.secure_url });
    } else {
      hero.imageUrl = imageUrl.secure_url;
      await hero.save();
    }

    res.json({ success: true, message: "Imagem do home atualizada com sucesso!", hero });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao atualizar a imagem do home." });
  }
};

export { getHeroImage, updateHeroImage };*/





/*
import { v2 as cloudinary } from "cloudinary";
import Hero from "../models/heroModel.js";

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "hero" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

const getHeroImage = async (req, res) => {
    try {
        const hero = await Hero.findOne();
        if (!hero) {
            return res.status(404).json({ success: false, message: "Imagem do home não encontrada." });
        }
        res.json({ success: true, hero });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao obter a imagem do home." });
    }
};

const updateHeroImage = async (req, res) => {
    try {
        const image = req.files?.image && req.files.image[0];
        if (!image) {
            return res.status(400).json({ success: false, message: "Nenhuma imagem enviada." });
        }

        const imageUrl = await streamUpload(image.buffer);

        let hero = await Hero.findOne();
        if (!hero) {
            hero = await Hero.create({ imageUrl });
        } else {
            hero.imageUrl = imageUrl;
            await hero.save();
        }

        res.json({ success: true, message: "Imagem do home atualizada com sucesso!", hero });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao atualizar a imagem do home." });
    }
};

export { getHeroImage, updateHeroImage };
*/





import HeroBanner from "../models/heroModel.js";
import { v2 as cloudinary } from "cloudinary";

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "hero" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

const getHeroImages = async (req, res) => {
  try {
    const banners = await HeroBanner.findAll();
    res.json({ success: true, images: banners.map((b) => b.imageUrl) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao obter banners." });
  }
};

const addHero = async (req, res) => {
  try {
    const image = req.files?.image && req.files.image[0];
    if (!image) return res.status(400).json({ success: false, message: "Nenhuma imagem enviada." });

    const imageUrl = await streamUpload(image.buffer);

    const newHero = await Hero.create({ imageUrl });

    res.json({ success: true, message: "Banner adicionado com sucesso!", hero: newHero });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao adicionar o banner." });
  }
};

const addHeroImage = async (req, res) => {
  try {
    const image = req.files?.image && req.files.image[0];
    if (!image) return res.status(400).json({ success: false, message: "Nenhuma imagem enviada." });

    const imageUrl = await streamUpload(image.buffer);
    await HeroBanner.create({ imageUrl });

    res.json({ success: true, message: "Imagem adicionada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao adicionar imagem." });
  }
};

const deleteHero = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await Hero.findByPk(id);

    if (!hero) {
      return res.json({ success: false, message: "Banner não encontrado" });
    }

    await hero.destroy();
    res.json({ success: true, message: "Banner removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao remover o banner" });
  }
}; 

export { getHeroImages, addHeroImage, deleteHero, addHero };
