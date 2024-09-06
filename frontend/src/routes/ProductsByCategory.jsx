import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/Product/ProductCard'; // Assuming you have a ProductCard component

const ProductsByCategory = ({ categoryId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(`/api/v1/categories/category/${categoryId}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products by category:', error);
      }
    };

    fetchProductsByCategory();
  }, [categoryId]);

  return (
    <div className="product-list">
      {Array.isArray(products) && products.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.product_id} product={product} />
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductsByCategory;
