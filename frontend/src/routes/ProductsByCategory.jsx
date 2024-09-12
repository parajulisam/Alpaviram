import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams
import ProductCard from "../components/Product/ProductCard";

const ProductsByCategory = () => {
  const { categoryId } = useParams(); // Get category_id from URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        console.log("Fetching products for category:", categoryId); // Log categoryId
        const response = await axios.get(
          `http://localhost:3001/api/v1/categories/category/${categoryId}`
        );

        console.log("API Response:", response.data); // Log API response data
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products by category:", error);
      }
    };

    fetchProductsByCategory();
  }, [categoryId]); // Re-run the effect when categoryId changes

  console.log("Products state:", products); // Log products state to see what gets rendered

  return (
    <div className="product-list">
      {Array.isArray(products) && products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductsByCategory;
