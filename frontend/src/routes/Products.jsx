import React, { useEffect } from "react";
import ProductCard from "../components/Product/ProductCard";
import Banner from "../components/Product/Banner";
import CategoryCard from "../components/Category/CategoryCard";
// import products from "../data/product";
// import { categories } from "../data/category";
import { useDispatch, useSelector } from "react-redux";

import { getRecommendedProducts } from "../features/recommendedProducts/product-actions";
import { getFeaturedProductList } from "../features/featuredProducts/product-actions";
import { getCategoryList } from "../features/category/category-actions";
import { Link } from "react-router-dom";
import { key } from "localforage";

const Products = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.featuredProductList);
  const { products } = productList;

  const recommendedProductList = useSelector((state) => state.recommendedProducts);
  const { products: recommendedProducts } = recommendedProductList;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  useEffect(() => {
    dispatch(getRecommendedProducts());
    dispatch(getFeaturedProductList());
    dispatch(getCategoryList());
  }, [dispatch]);

  return (
    <>
      {/* <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="img border border-red-500 ">IMG</div>
        <div className="details border border-red-500 ">Details</div>
        <div className="order border border-red-500 ">Order</div>
      </div>

      <div className="reviews"></div>

      <div className="recommendations"></div> */}
      <Banner />
      <div className=" px-6 py-6  max-w-screen-2xl mx-auto ">
        {/* title */}
        <div className="title flex justify-center  py-2">
          <span className="font-medium text-xl uppercase md:text-2xl px-4 tracking-wide ">
            Recommendation
          </span>
        </div>

        {/* featured products */}
        <div className="flex flex-wrap justify-evenly  px-4 ">
          {recommendedProducts.map((product) => (
            <ProductCard product={product} key={product.product_id} />
          ))}
        </div>
        {/* end of featured products */}

        <br />
        <br />

        {/* title */}
        <div className="title flex justify-center  py-2">
          <span className="font-medium text-xl uppercase md:text-2xl px-4 tracking-wide ">
            Featured Products
          </span>
        </div>

        {/* featured products */}
        <div className="flex flex-wrap justify-evenly  px-4 ">
          {products.map((product) => (
            <ProductCard product={product} key={product.product_id} />
          ))}
        </div>
        {/* end of featured products */}

        <br />
        <br />

        {/* categories  title*/}
        <div className="title flex justify-center py-2  my-3 ">
          <span className="font-medium uppercase text-xl md:text-2xl px-4 tracking-wide ">
            Our Categories
          </span>
        </div>

        {/* category list */}
        <div className=" flex flex-wrap justify-evenly  px-4 py-2 ">
          {categories.map((category, index) => (
            <Link to={`filterByCategory/${category.category_id}`} key={index}>
              <CategoryCard category={category} key={category.category_id} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
