import db from "../models/index.js";
import { sequelize } from "../config/db.js";
import { Sequelize } from "sequelize";

const Product = db.product;
const Category = db.category;
const Brand = db.brand;
const Review = db.review;
const User = db.user;
const Op = Sequelize.Op;

// @desc    Fetch all featured products
// @route   GET api/v1/products
// @access  Public (anything can hit it)
const findAllFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { featured: 1 } });
    res.json(products);
  } catch (error) {
    res.status(500);
    throw new Error("Error retrieving product details!");
  }
};

// @desc    Fetch product by ID
// @route   GET /api/v1/products/:id
// @access  Public

const findProductById = async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findOne({
    where: {
      product_id: productId,
    },
    attributes: { exclude: ["category_id", "brand_id"] },
    include: [
      {
        model: Category,
        required: true,
        attributes: ["category_id", "name"],
      },
      {
        model: Brand,
        required: true,
        attributes: ["brand_id", "name"],
      },

      {
        model: Review,
        attributes: { exclude: ["user_id"] },
        include: {
          model: User,
          attributes: ["user_id", "first_name", "last_name"],
        },
      },
    ],
  });

  // // if product is found
  // // if id is formatted validly
  if (product) {
    return res.json(product);
  } else {
    // not found error code
    res.status(404);
    throw new Error("Cannot find the product!");
  }
};

// Function to calculate recommendation score for a product based on preferences
const calculateRecommendationScore = (product, preference) => {
  let score = 0;

  // Calculate score based on category preference
  if (product.category_id && preference.category && preference.category[product.category_id]) {
    score += preference.category[product.category_id];
  }

  // Calculate score based on brand preference
  if (product.brand_id && preference.brand && preference.brand[product.brand_id]) {
    score += preference.brand[product.brand_id];
  }

  return score;
};

// @desc    Fetch recommended products based on preferences
// @route   POST /api/v1/get/recommendations
// @access  Public
const getRecommendedProducts = async (req, res) => {
  try {
    const preference = req.body;

    if (!preference || typeof preference !== "object") {
      return res.status(400).json({ message: "Invalid preferences format" });
    }

    let products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Brand,
          attributes: ["brand_id", "name"],
        },
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Apply recommendation scoring logic based on preferences
    if (preference) {
      products = products
        .map((product) => {
          const recommendationScore = calculateRecommendationScore(product, preference);
          return {
            ...product.dataValues, // Extract product data
            recommendationScore,
          };
        })
        .sort((a, b) => b.recommendationScore - a.recommendationScore); // Sort by recommendation score
    } else {
      // If no preference is provided, sort by newest products
      products = products.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Return only the top 10 recommended products
    const topProducts = products.slice(0, 10);

    return res.status(200).json(topProducts);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Protected/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imagePath,
      countInStock,
      category_id,
      brand_id, // Assuming you're passing brand_id in the request body
      featured,
    } = req.body;

    const product = {
      name,
      description,
      price,
      imagePath,
      countInStock,
      category_id,
      brand_id, // Include brand_id when creating the product
      user_id: req.user.id,
      featured,
    };

    const newProduct = await Product.create(product);
    console.log("db.sequelize", db.sequelize);

    // Adding category and brand info
    const createdProduct = await Product.findByPk(newProduct.product_id, {
      attributes: [
        "product_id",
        "name",
        "description",
        "price",
        "imagePath",
        "countInStock",
        "user_id",
        "category_id",
        "brand_id", // Include brand_id in the attributes to fetch
        "featured",
        // Assuming db.sequelize.col is correctly set up to access the category name
        [sequelize.col("category.name"), "category_name"],
        [sequelize.col("brand.name"), "brand_name"], // Include brand name similarly
      ],
      include: [
        {
          model: Category,
          as: "category",
          attributes: [],
        },
        {
          model: Brand, // Include the Brand model in the query
          as: "brand", // Make sure the alias matches the one defined in your model associations
          attributes: [],
        },
      ],
    });

    res.status(201).json({
      message: "Product created Successfully",
      createdProduct,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).json({ message: "Something went wrong!" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Protected/Admin
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const num = await Product.destroy({ where: { product_id: productId } });

    if (num == 1) {
      res.json({ message: "Product removed succesfully!" });
    } else {
      res.status(500);
      throw new Error("Product could not be found!");
    }
  } catch (error) {
    console.log("here");
    throw new Error(error.message);
  }
};

// @desc    To update product by id
// @route   PUT /api/v1/products/:id
// @access  Protected/Admin

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imagePath,
      countInStock,
      category_id,
      brand_id,
      featured,
    } = req.body;

    // Log the incoming request body
    console.log("Request body:", req.body);

    // Find the product by ID
    const product = await Product.findByPk(req.params.id);

    // Log the product before updating
    console.log("Product before update:", product);

    if (!product) {
      res.status(404).json({ error: "Product could not be found!" });
      return;
    }

    // Update only the fields that are present in the request body
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (imagePath !== undefined) product.imagePath = imagePath;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (category_id !== undefined) product.category_id = category_id;
    if (brand_id !== undefined) product.brand_id = brand_id;
    if (featured !== undefined) product.featured = parseInt(featured, 10); // Ensure this is an integer

    // Save the updated product
    const editedProduct = await product.save();

    // Log the product after saving
    console.log("Product after saving:", editedProduct);

    // Adding category info
    const updatedProduct = await Product.findByPk(editedProduct.product_id, {
      attributes: [
        "product_id",
        "name",
        "description",
        "price",
        "imagePath",
        "countInStock",
        "category_id",
        "brand_id",
        "featured",
        [sequelize.col("category.name"), "category_name"],
        [sequelize.col("brand.name"), "brand_name"],
      ],
      include: [
        {
          model: Category,
          as: "category",
          attributes: [], // Ensure correct model association
        },
        {
          model: Brand,
          as: "brand",
          attributes: [], // Ensure correct model association
        },
      ],
    });

    // Send response
    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (err) {
    // Log the error
    console.error("Error updating product:", err.message);

    // Send error response
    res.status(500).json({ error: err.message });
  }
};

// @desc    To fetch all products for admin
// @route   PUT /api/v1/products
// @access  Protected/Admin
const findAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    // const products = await Product.findAll({
    //   attributes: { exclude: ["category_id", "brand_id"] },
    //   include: [
    //     {
    //       model: Category,
    //       required: true,
    //       attributes: ["category_id", "name"],
    //     },
    //     {
    //       model: Brand,
    //       required: true,
    //       attributes: ["brand_id", "name"],
    //     },
    //   ],
    //   order: [["createdAt", "DESC"]],
    // });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Create product review
// @route   POST /api/v1/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  // review object
  const review = {
    rating: parseFloat(rating),
    comment,
    product_id: req.params.id,
    user_id: req.user.id,
  };
  // To create review
  const createdReview = await Review.create(review);

  // To update numReviews and rating of the corresponding product
  const product = await Product.findByPk(req.params.id, {
    include: {
      model: Review,
    },
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce(
      (acc, product) => parseFloat(product.rating) + acc,
      0
    ) / product.reviews.length;

  await product.save();

  // created review
  res.status(201).json(createdReview);
};

// @desc    Get search products
// @route   GET /api/v1/products/search?keyword=[keyword]
// @access  Public

const getSearchedProducts = async (req, res) => {
  const keyword = req.query.keyword.toLowerCase();

  const matchedProducts = await Product.findAll({
    where: {
      name: {
        [Op.like]: `%${keyword}%`,
      },
    },

    // limit: pageSize,
    // offset: pageSize * (page - 1),
  });

  res.json({ matchedProducts });
};
const getFilteredProducts = async (req, res) => {
  const { category_id, brand_id, rating, price } = req.query;
  let query = {};

  // Category filter
  if (category_id && category_id !== "0") {
    query["category_id"] = parseInt(category_id);
  }

  // Brand filter
  if (brand_id && brand_id !== "0") {
    query["brand_id"] = parseInt(brand_id);
  }

  // Rating filter
  if (rating && rating !== "6") {
    // '6' as a placeholder for "Any Rating"
    query["rating"] = parseFloat(rating);
  }

  // Price price filter
  if (price && price !== "0") {
    const [min, max] = price.split("-").map(Number);
    query["price"] = { [Op.gte]: min, [Op.lte]: max };
  }

  // Log the constructed query object
  console.log("Constructed Query: ", query);

  try {
    const products = await Product.findAll({ where: query }); // Use Sequelize's findAll method
    console.log("Products Found: ", products); // Log the found products
    res.json(products);
  } catch (error) {
    console.error("Error fetching products: ", error); // Log the error details
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export {
  findProductById,
  getRecommendedProducts,
  getSearchedProducts,
  findAllProducts,
  findAllFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFilteredProducts,
};
