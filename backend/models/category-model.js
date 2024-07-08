import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Category = sequelize.define("category", {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  imagePath: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

export default Category;
