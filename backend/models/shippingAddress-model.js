import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ShippingAddress = sequelize.define("shipping_address", {
  shipping_address_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  contact_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },

  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  postal_code: {
    type: DataTypes.CHAR(5),
    allowNull: false,
  },

  street: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  province: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

export default ShippingAddress;
