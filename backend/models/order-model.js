import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Order = sequelize.define("order", {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  total_amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },

  is_paid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  paid_at: {
    type: DataTypes.DATE,
  },

  is_delivered: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  delivered_at: {
    type: DataTypes.DATE,
  },

  payment_method: {
    type: DataTypes.STRING(50),
  },

  status: {
    type: DataTypes.STRING(50),
  },
});

export default Order;
