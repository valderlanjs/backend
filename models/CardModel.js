// models/Card.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Card = sequelize.define("Card", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING, // URL da imagem
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Card;
