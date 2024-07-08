import db from "../models/index.js";

const Brand = db.brand;
const Product = db.product;

// @desc    Fetch all brands
// @route   GET /api/v1/brands
// @access  Public
const findAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching brands!" });
  }
};

// @desc    To create a new brand
// @route   POST /api/v1/brands
// @access  Protected
const createBrand = async (req, res) => {
  try {
    const { name, imagePath } = req.body;

    const brand = {
      name,
      imagePath,
    };

    const createdBrand = await Brand.create(brand);

    res.status(201).json({
      message: "Brand created successfully",
      createdBrand,
    });
  } catch (err) {
    res.status(500).json({
      message: "Brand could not be created at this moment. Try again!",
    });
  }
};

// @desc    To delete a brand by id
// @route   DELETE /api/v1/brands/:id
// @access  Protected
const deleteBrand = async (req, res) => {
  const brandId = req.params.id;

  // Checking if there is a brand
  const brand = await Brand.findByPk(brandId);

  if (brand) {
    // Checking if there are products under the brand
    const product = await Product.findOne({
      where: {
        brand_id: brandId,
      },
    });

    if (product) {
      res
        .status(500)
        .json({ message: "There are product(s) under this brand" });
    } else {
      await brand.destroy();
      res.json({ message: "Brand deleted successfully" });
    }
  } else {
    res.status(404).json({ message: "Brand not found" });
  }
};
// @desc    To update brand by id
// @route   PUT /api/v1/brands/:id
// @access  Protected
const updateBrand = async (req, res) => {
  try {
    const { name, imagePath } = req.body; // Assuming brands have similar fields
    const brand = await Brand.findByPk(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    brand.name = name || brand.name;
    brand.imagePath = imagePath || brand.imagePath;

    const updatedBrand = await brand.save();

    res.json({
      message: "Brand updated successfully",
      updatedBrand,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Brand could not be updated at this moment. Try Again!",
      });
  }
};

export { findAllBrands, createBrand, updateBrand, deleteBrand };
