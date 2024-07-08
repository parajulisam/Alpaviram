import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const OrderLine = sequelize.define("order_line", {
  orderline_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // order_id and product_id => composite key
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  price: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  line_total: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
});

export default OrderLine;
