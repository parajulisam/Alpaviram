import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures the field is not empty
      },
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    contact_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures email is unique
      validate: {
        isEmail: true, // Validates email format
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures password is provided
        len: [6, 100], // Password length between 6 and 100 characters
      },
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 is a normal user, 1 is an admin
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default User;
