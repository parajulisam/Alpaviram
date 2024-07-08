import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import useCategory from "../../../hooks/useCategory";

export default function CategoryModal({ closeHandler, isAdd, data }) {
  const {
    name,
    imagePath,
    onSubmit,
    handleChange,
    setFormData,
    setUpdate,
    setOldImagePath,
  } = useCategory();

  useEffect(() => {
    if (data && !isAdd) {
      setFormData({
        name: data.name,
        imagePath: data.imagePath,
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
              {isAdd ? "Add" : "Update"} Category
            </h2>
            <IoClose className="size-8 cursor-pointer" onClick={closeHandler} />
          </div>
          <form
            encType="multipart/form-data"
            onSubmit={(e) => {
              let response = false;
              if (data && !isAdd) {
                e.preventDefault();
                response = onSubmit(e, data.category_id);
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
                placeholder="Category Name"
                className="border outline-none px-3 py-2 rounded-md placeholder:text-sm border-slate-300"
              />
            </div>
            <div className="flex flex-col gap-1 py-2">
              <label htmlFor="image" className="text-sm text-gray-600">
                Image *
              </label>
              <input
                required={isAdd ? true : false}
                name="image"
                title="image"
                type="file"
                onChange={handleChange}
                accept="image/jpeg, image/png, image/jpg"
                className="border outline-none rounded-md placeholder:text-sm border-slate-300 file:border-none file:px-3 file:py-2 file:mr-2 file:cursor-pointer"
              />
            </div>
            {!isAdd && data && (
              <div className="p-2 bg-gray-100">
                <img
                  src={imagePath ? `${imagePath}` : ""}
                  alt="Category Image"
                  className="object-fill rounded-lg max-w-[150px]"
                />
              </div>
            )}
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
