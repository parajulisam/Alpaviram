import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Review = sequelize.define("review", {
  review_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
  },
});

export default Review;
