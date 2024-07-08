import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import useProduct from "../../../hooks/useProduct";
import { apiUrl } from "../../Product/ProductCard";

export default function ProductModal({ closeHandler, isAdd, data }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const {
    name,
    price,
    description,
    countInStock,
    category_id,
    brand_id,
    featured,
    imagePath,
    onSubmit,
    handleChange,
    setFormData,
    setUpdate,
    setOldImagePath,
  } = useProduct();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(
        "http://localhost:3001/api/v1/categories"
      );
      setCategories(data);
    };
    const fetchBrands = async () => {
      const { data } = await axios.get("http://localhost:3001/api/v1/brands");
      setBrands(data);
    };
    fetchCategories();
    fetchBrands();
    if (data && !isAdd) {
      setFormData({
        name: data.name,
        price: data.price,
        description: data.description,
        imagePath: data.imagePath,
        countInStock: data.countInStock,
        category_id: data.category.category_id,
        brand_id: data.brand.brand_id,
        featured: data.featured,
      });
      setOldImagePath(data.imagePath);
      setUpdate(true);
    }
  }, []);

  return (
    <>
      <div
        className="w-[100vw] h-[100vh] fixed flex justify-center items-center bg-black/30 top-0 left-0 z-[999]"
        onClick={closeHandler}
      >
        <div
          className="bg-white w-full px-3 md:p-10 py-5 md:min-w-[800px] md:max-w-[900px] md:min-h-[400px] shadow-xl rounded-lg m-3 max-h-[95vh] overflow-y-scroll pb-20 lg:pb-5"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="py-3  pb-8 flex justify-between items-center">
            <h2 className="text-xl font-bold ">
              {isAdd ? "Add" : "Update"} Product
            </h2>
            <IoClose className="size-8 cursor-pointer" onClick={closeHandler} />
          </div>
          <form
            encType="multipart/form-data"
            onSubmit={(e) => {
              let response = false;
              if (data && !isAdd) {
                e.preventDefault();
                response = onSubmit(e, data.product_id);
              } else {
                response = onSubmit(e);
              }
              if (response) {
                const timer = setTimeout(() => {
                  closeHandler();
                }, 500);
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-0">
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Name *
                </label>
                <input
                  required
                  name="name"
                  value={name ?? ""}
                  onChange={handleChange}
                  title="name"
                  type="text"
                  placeholder="Iphone 15 pro max"
                  className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300`}
                  // className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm ${
                  //   fullNameError !== ""
                  //     ? " border-red-500"
                  //     : "border-slate-300"
                  // }`}
                />
                {/* {nameError !== "" && (
                  <p className="pb-2 text-red-500 text-sm">{nameError}</p>
                )} */}
              </div>
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Price *
                </label>
                <input
                  required
                  value={price ?? 0}
                  onChange={handleChange}
                  min={10}
                  name="price"
                  title="price"
                  type="number"
                  placeholder="1000"
                  className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300`}
                  // className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm ${
                  //   usernameError !== ""
                  //     ? " border-red-500"
                  //     : "border-slate-300"
                  // }`}
                />
                {/* {priceError !== "" && (
                    <p className="pb-2 text-red-500 text-sm">{priceError}</p>
                  )} */}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-0">
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Count in stock *
                </label>
                <input
                  required
                  value={countInStock ?? 0}
                  onChange={handleChange}
                  name="countInStock"
                  title="countInStock"
                  type="number"
                  min={0}
                  placeholder="0"
                  className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300`}
                  // className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm ${
                  //   fullNameError !== ""
                  //     ? " border-red-500"
                  //     : "border-slate-300"
                  // }`}
                />
                {/* {countInStockError !== "" && (
                  <p className="pb-2 text-red-500 text-sm">{countInStockError}</p>
                )} */}
              </div>
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Category *
                </label>
                <select
                  required
                  value={category_id ?? categories[0].category_id}
                  onChange={handleChange}
                  name="category_id"
                  title="category_id"
                  className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300`}
                  // className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm ${
                  //   roleIdError !== "" ? " border-red-500" : "border-slate-300"
                  // }`}
                >
                  <option value="">Choose Category</option>
                  {categories.map((category) => {
                    return (
                      <option
                        value={category.category_id}
                        key={category.category_id}
                      >
                        {category.name}
                      </option>
                    );
                  })}
                </select>
                {/* {priceError !== "" && (
                    <p className="pb-2 text-red-500 text-sm">{priceError}</p>
                  )} */}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-0">
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Brand *
                </label>
                <select
                  required
                  name="brand_id"
                  value={brand_id ?? brands[0].brand_id}
                  onChange={handleChange}
                  title="brand_id"
                  className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300`}
                  // className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm ${
                  //   roleIdError !== "" ? " border-red-500" : "border-slate-300"
                  // }`}
                >
                  <option value="">Choose brand</option>
                  {brands.map((brand) => {
                    return (
                      <option value={brand.brand_id} key={brand.brand_id}>
                        {brand.name}
                      </option>
                    );
                  })}
                </select>
                {/* {priceError !== "" && (
                    <p className="pb-2 text-red-500 text-sm">{priceError}</p>
                  )} */}
              </div>
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Image *
                </label>
                <input
                  required={isAdd ? true : false}
                  name="image"
                  title="image"
                  type="file"
                  onChange={handleChange}
                  accept="image/jpeg, image/png, image/jpg"
                  className={`border outline-none rounded-md placeholder:text-sm border-slate-300 file:border-none file:px-3 file:py-2 file:mr-2 file:cursor-pointercursor-pointer`}
                />
              </div>
            </div>

            <div
              className={`grid grid-cols-1 md:${
                data ? "grid-cols-2" : "grid-cols-1"
              } gap-2 gap-y-0`}
            >
              <div className="flex flex-col gap-1 py-2">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Description *
                </label>
                <textarea
                  required
                  name="description"
                  value={description ?? ""}
                  onChange={handleChange}
                  title="description"
                  type="text"
                  placeholder="enter the description of the product"
                  className={`border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300`}
                />
              </div>
              {!isAdd && data && (
                <div className="p-2 bg-gray-100">
                  <div className="flex gap-x-3">
                    <img
                      src={`${apiUrl}${imagePath}`}
                      alt="no image"
                      className="object-fill rounded-lg max-w-[150px]"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-x-6">
              <div className="flex gap-x-3 py-2 items-center">
                <label htmlFor="email" className="text-sm text-gray-600">
                  Featured
                </label>
                <input
                  name="featured"
                  type="checkbox"
                  title="featured"
                  checked={featured === 1}
                  onChange={handleChange}
                  className={`border  outline-none px-3 rounded-md placeholder:text-sm border-slate-300`}
                />
              </div>
            </div>

            <div className="md:pt-8 md:pb-2 md:flex justify-between items-center">
              <p className="text-xs">*This field is mandatory</p>
              <div className="flex gap-2 items-center pt-3 justify-end">
                <button
                  type="button"
                  onClick={closeHandler}
                  className="px-6 py-2 border border-black text-sm rounded-lg hover:bg-black hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-black text-sm rounded-lg bg-black text-white"
                >
                  {isAdd ? "Add" : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
