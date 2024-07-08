import axios from "axios";
import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function DeleteCategoryModal({ closeHandler, id }) {
  const { token } = useSelector((state) => state.token);

  const deleteCategory = async (id) => {
    await axios.delete(`http://localhost:3001/api/v1/categories/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    return () => {
      // Clean up any timers or listeners
    };
  }, []);

  return (
    <>
      <div
        className="w-screen h-screen fixed flex justify-center items-center bg-black/30 top-0 left-0 z-[9999]"
        onClick={closeHandler}
      >
        <div
          className="bg-white p-10 max-w-md w-full rounded-lg m-3 overflow-y-auto"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="py-3 pb-8 flex justify-between items-center">
            <h2 className="text-xl font-bold ">Delete Category</h2>
            <IoClose className="size-8 cursor-pointer" onClick={closeHandler} />
          </div>
          <form
            encType="multipart/form-data"
            onSubmit={(e) => {
              e.preventDefault();
              deleteCategory(id);
              toast.success("Category deleted successfully", {
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
