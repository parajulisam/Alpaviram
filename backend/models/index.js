import Brand from "./brand-model.js";
import Category from "./category-model.js";
import Order from "./order-model.js";
import OrderLine from "./orderline-model.js";
import Product from "./product-model.js";
import Review from "./review-model.js";
import ShippingAddress from "./shippingAddress-model.js";
import User from "./user-model.js";

const db = {};

db.user = User;
db.category = Category;
db.product = Product;
db.review = Review;
db.order = Order;
db.orderLine = OrderLine;
db.brand = Brand;
db.shippingAddress = ShippingAddress;

// Relationship between product and (user, Category, brand)
// with user
db.user.hasMany(db.product, {
  foreignKey: "user_id",
});
db.product.belongsTo(db.user, {
  foreignKey: "user_id",
});

// with category
db.category.hasMany(db.product, {
  foreignKey: "category_id",
});
db.product.belongsTo(db.category, {
  foreignKey: "category_id",
});

// Relationship between product and Brand
db.brand.hasMany(db.product, {
  foreignKey: "brand_id",
});
db.product.belongsTo(db.brand, {
  foreignKey: "brand_id",
});

// Relationship between review and (user, product)
// with user
db.user.hasMany(db.review, {
  foreignKey: "user_id",
});
db.review.belongsTo(db.user, {
  foreignKey: "user_id",
});

// with product
db.product.hasMany(db.review, {
  foreignKey: "product_id",
});
db.review.belongsTo(db.product, {
  foreignKey: "product_id",
});

// Relationship between order and user
db.user.hasMany(db.order, {
  foreignKey: "user_id",
});
db.order.belongsTo(db.user, {
  foreignKey: "user_id",
});

// Relationship between Product and Order
// MANY TO MANY RELATIONSHIP
db.product.belongsToMany(db.order, {
  through: db.orderLine,
  foreignKey: "product_id",
});

db.order.belongsToMany(db.product, {
  through: db.orderLine,
  foreignKey: "order_id",
});

// Relationship between order and shipping address
db.shippingAddress.hasOne(db.order, {
  foreignKey: "shipping_address_id",
});

db.order.belongsTo(db.shippingAddress, {
  foreignKey: "shipping_address_id",
});

export default db;
