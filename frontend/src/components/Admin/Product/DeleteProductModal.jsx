import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function DeleteProductModal({ closeHandler, id }) {
  const { token } = useSelector((state) => state.token);
  const deleteProduct = async (id) => {
    const data = await axios.delete(
      `http://localhost:3001/api/v1/products/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return (
    <>
      <div
        className="w-[100vw] h-[100vh] fixed flex justify-center items-center bg-black/30 top-0 left-0 z-[999]"
        onClick={closeHandler}
      >
        <div
          className="bg-white px-3 md:p-10 py-5 w-[800px] md:min-h-[100px] shadow-xl rounded-lg m-3 max-h-[95vh] overflow-y-scroll pb-20 lg:pb-5"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="py-3  pb-8 flex justify-between items-center">
            <h2 className="text-xl font-bold ">Delete Product</h2>
            <IoClose className="size-8 cursor-pointer" onClick={closeHandler} />
          </div>
          <form
            encType="multipart/form-data"
            onSubmit={(e) => {
              e.preventDefault();

              deleteProduct(id);
              toast.success("Product deleted successfully", {
                position: "top-right",
                style: { backgroundColor: "black", color: "white" },
              });
              const timer = setTimeout(() => {
                closeHandler();
              }, 500);
            }}
          >
            <div className="md:pt-8 md:pb-2 md:flex justify-end items-center">
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
                  Delete
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
