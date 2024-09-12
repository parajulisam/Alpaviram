import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import useProduct from "../../../hooks/useProduct";
import { apiUrl } from "../../Product/ProductCard";

export default function ProductModal({ closeHandler, isAdd, data }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const {
    name = "",
    price = "",
    description = "",
    countInStock = "",
    category_id = "",
    brand_id = "",
    featured = false,
    imagePath = "",
    onSubmit,
    handleChange,
    setFormData,
    setUpdate,
    setOldImagePath,
  } = useProduct();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoryData } = await axios.get(
          "http://localhost:3001/api/v1/categories"
        );
        console.log("Fetched categories:", categoryData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const { data: brandData } = await axios.get(
          "http://localhost:3001/api/v1/brands"
        );
        console.log("Fetched brands:", brandData);
        setBrands(brandData);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };

    fetchCategories();
    fetchBrands();

    if (data && !isAdd) {
      console.log("Setting form data for update:", data);
      setFormData({
        name: data.name || "",
        price: data.price || "",
        description: data.description || "",
        imagePath: data.imagePath || "",
        countInStock: data.countInStock || "",
        category_id: data.category ? data.category.category_id : "",
        brand_id: data.brand ? data.brand.brand_id : "",
        featured: data.featured || false,
      });
      setOldImagePath(data.imagePath || "");
      setUpdate(true);
    }
  }, [data, isAdd, setFormData, setOldImagePath, setUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert featured to integer for submission
    const submitFeatured = featured ? 1 : 0;

    console.log("Form data before submit:", {
      name,
      price,
      description,
      countInStock,
      category_id,
      brand_id,
      featured: submitFeatured,
    });

    let response = false;
    try {
      if (data && !isAdd) {
        response = await onSubmit(e, data.product_id);
      } else {
        response = await onSubmit(e);
      }
      console.log("Submit response:", response);
    } catch (error) {
      console.error("Error during form submission:", error);
    }

    if (response) {
      const timer = setTimeout(() => {
        closeHandler();
      }, 500);
    }
  };

  return (
    <>
      <div
        className="w-[100vw] h-[100vh] fixed flex justify-center items-center bg-black/30 top-0 left-0 z-[999]"
        onClick={closeHandler}
      >
        <div
          className="bg-white w-full px-3 md:p-10 py-5 md:min-w-[800px] md:max-w-[900px] md:min-h-[400px] shadow-xl rounded-lg m-3 max-h-[95vh] overflow-y-scroll pb-20 lg:pb-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-3 pb-8 flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {isAdd ? "Add" : "Update"} Product
            </h2>
            <IoClose className="size-8 cursor-pointer" onClick={closeHandler} />
          </div>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-0">
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Name *
                </label>
                <input
                  required
                  name="name"
                  value={name}
                  onChange={handleChange}
                  title="name"
                  type="text"
                  placeholder="Iphone 15 pro max"
                  className="border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300"
                />
              </div>
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="price" className="text-sm text-gray-600">
                  Price *
                </label>
                <input
                  required
                  value={price}
                  onChange={handleChange}
                  min={10}
                  name="price"
                  title="price"
                  type="number"
                  placeholder="1000"
                  className="border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-0">
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="countInStock" className="text-sm text-gray-600">
                  Count in stock *
                </label>
                <input
                  required
                  value={countInStock}
                  onChange={handleChange}
                  name="countInStock"
                  title="countInStock"
                  type="number"
                  min={0}
                  placeholder="0"
                  className="border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300"
                />
              </div>
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="category_id" className="text-sm text-gray-600">
                  Category *
                </label>
                <select
                  required
                  value={category_id}
                  onChange={handleChange}
                  name="category_id"
                  title="category_id"
                  className="border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300"
                >
                  <option value="">Choose Category</option>
                  {categories.map((category) => (
                    <option
                      value={category.category_id}
                      key={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-0">
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="brand_id" className="text-sm text-gray-600">
                  Brand *
                </label>
                <select
                  required
                  name="brand_id"
                  value={brand_id}
                  onChange={handleChange}
                  title="brand_id"
                  className="border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300"
                >
                  <option value="">Choose brand</option>
                  {brands.map((brand) => (
                    <option value={brand.brand_id} key={brand.brand_id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="image" className="text-sm text-gray-600">
                  Image *
                </label>
                <input
                  required={isAdd}
                  name="image"
                  title="image"
                  type="file"
                  onChange={handleChange}
                  accept="image/jpeg, image/png, image/jpg"
                  className="border outline-none rounded-md placeholder:text-sm border-slate-300 file:border-none file:px-3 file:py-2 file:mr-2 file:cursor-pointer"
                />
              </div>
            </div>

            <div
              className={`grid grid-cols-1 md:${
                data ? "grid-cols-2" : "grid-cols-1"
              } gap-2 gap-y-0`}
            >
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="description" className="text-sm text-gray-600">
                  Description *
                </label>
                <textarea
                  required
                  name="description"
                  value={description}
                  onChange={handleChange}
                  title="description"
                  placeholder="Enter the description of the product"
                  className="border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300"
                />
              </div>
              {!isAdd && data && (
                <div className="p-2 bg-gray-100">
                  <div className="flex gap-x-3">
                    <img
                      src={`${apiUrl}${imagePath}`}
                      alt="Product"
                      className="object-fill rounded-lg max-w-[150px]"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-x-6">
              <div className="flex gap-x-3 py-2 items-center">
                <label htmlFor="featured" className="text-sm text-gray-600">
                  Featured
                </label>
                <input
                  name="featured"
                  type="checkbox"
                  title="featured"
                  checked={featured}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "featured", value: e.target.checked },
                    })
                  }
                  className="border outline-none rounded-md border-slate-300"
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-4 py-2">
              <button
                type="button"
                className="py-2 px-4 rounded-md bg-red-500 text-white"
                onClick={closeHandler}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 rounded-md bg-blue-500 text-white"
              >
                {isAdd ? "Add Product" : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
