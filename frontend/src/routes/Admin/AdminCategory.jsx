import React, { useEffect, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import CategoryModal from "../../components/Admin/Category/CategoryModal"; // Import the CategoryModal component
import axios from "axios";
import DeleteCategoryModal from "../../components/Admin/Category/DeleteCategoryModal";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { apiUrl } from "../../components/Product/ProductCard";

const AdminCategory = () => {
  const [showModal, setShowModal] = useState(false);

  // Function to toggle the visibility of the modal
  const toggleShowModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      document.body.classList.add("disable-scrolling");
    } else {
      document.body.classList.remove("disable-scrolling");
    }
  };
  const [isUpdate, setIsUpdate] = useState(false);

  const toggleUpdateShowModal = () => {
    setIsUpdate(!isUpdate);
    setShowModal(!showModal);
    if (showModal == false) {
      document.body.classList.add("disable-scrolling");
    } else {
      document.body.classList.remove("disable-scrolling");
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const [idToUpdate, setIdToUpdate] = useState(0);

  const [searchString, setSearchString] = useState("");
  const handleSearchStringChange = (e) => {
    setSearchString(e.target.value);
  };

  const [allCategories, setAllCategories] = useState([]);
  const [categoriesToDisplay, setCategoriesToDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perpage = 3;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(
        "http://localhost:3001/api/v1/categories"
      );
      setAllCategories(data);
    };
    fetchCategories();
  }, [showModal, showDeleteModal]); // Trigger fetchCategories on showModal change

  useEffect(() => {
    if (searchString !== "") {
      const searchedData = allCategories.filter((category) =>
        category.name.toLowerCase().includes(searchString.toLowerCase())
      );
      setTotalPages(Math.ceil(searchedData.length / perpage));
      setCurrentPage(1);
      setCategoriesToDisplay(
        searchedData.slice(
          currentPage * perpage - perpage,
          currentPage * perpage
        )
      );
    } else {
      setTotalPages(Math.ceil(allCategories.length / perpage));
      setCategoriesToDisplay(
        allCategories.slice(
          currentPage * perpage - perpage,
          currentPage * perpage
        )
      );
    }
  }, [allCategories, currentPage, searchString]);

  // console.log(categoriesToDisplay);

  return (
    <>
      {/* Modal component */}
      {showModal && !isUpdate && (
        <CategoryModal closeHandler={toggleShowModal} isAdd={true} />
      )}
      {showDeleteModal && (
        <DeleteCategoryModal
          closeHandler={toggleShowDeleteModal}
          id={idToUpdate}
        />
      )}

      {showModal && isUpdate && (
        <CategoryModal
          closeHandler={toggleUpdateShowModal}
          data={allCategories.find(
            (category) => category.category_id === idToUpdate
          )}
          isAdd={false}
        />
      )}

      <div className="pb-5 flex justify-between px-20">
        <h1 className="text-2xl font-medium">All Categories</h1>
        <div className="flex gap-x-3">
          <p
            className="p-2 bg-[#2c2c2c] px-4 rounded-md text-white cursor-pointer"
            onClick={toggleShowModal}
          >
            Add Category
          </p>
          <div className="min-w-[250px] bg-[#D9D9D9] p-5 rounded-md relative">
            <IoSearch className="absolute left-2 top-3 size-4" />
            <IoClose className="absolute right-2 top-3 size-4" />
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearchStringChange}
              className="absolute top-1 left-8 p-1 pb-0 bg-[#D9D9D9] placeholder:text-[#686868] focus:border-none outline-none"
            />
          </div>
        </div>
      </div>

      <div className=" px-4 md:px-20 pb-10  overflow-x-scroll ">
        <table className="table-auto bg-[#2C2C2C] md:w-full  ">
          <thead className="rounded-lg">
            <tr>
              <th className="p-3 py-4 text-start text-white">S.N.</th>
              {/* <th className="p-3 py-4 text-start text-white">Image</th> */}
              <th className="p-3 py-4 text-start text-white">Name</th>
              <th className="p-3 py-4 text-center text-white">Options</th>
            </tr>
          </thead>
          <tbody>
            {categoriesToDisplay.map((category, index) => {
              return (
                <tr key={index} className="bg-white">
                  <td className="p-3">{index + 1}</td>
                  {/* <td className="p-3 ">
                    <img
                      src={`${apiUrl}${category.imagePath}`}
                      alt="no image"
                      className="object-fill rounded-lg max-w-[100px]"
                    />
                  </td> */}
                  <td className="p-3">{category.name}</td>
                  <td className="p-3">
                    <div className="justify-center flex gap-x-2">
                      <BiSolidEditAlt
                        onClick={() => {
                          setIdToUpdate(category.category_id);
                          toggleUpdateShowModal();
                        }}
                        className="size-5 cursor-pointer"
                      />
                      <MdDelete
                        className="size-5 text-red-500 cursor-pointer"
                        onClick={() => {
                          setIdToUpdate(category.category_id);
                          toggleShowDeleteModal();
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="w-full bg-gray-200 p-2 flex justify-end gap-x-2">
          <div className="w-full bg-gray-200 p-2 flex justify-end gap-x-2">
            <div
              className={`px-2 bg-white rounded-sm  text-xs shadow-sm py-1 cursor-pointer ${
                currentPage - 1 < 1 && "hidden"
              }`}
              onClick={() => {
                setCurrentPage(currentPage - 1);
              }}
            >
              {currentPage - 1}
            </div>
            <div
              className="px-2 bg-black text-white rounded-sm text-xs shadow-sm py-1 cursor-pointer "
              onClick={() => {
                setCurrentPage(currentPage);
              }}
            >
              {currentPage}
            </div>
            <div
              className={`px-2 bg-white rounded-sm  text-xs shadow-sm py-1 cursor-pointer ${
                currentPage + 1 > totalPages && "hidden"
              }`}
              onClick={() => {
                setCurrentPage(currentPage + 1);
              }}
            >
              {currentPage + 1}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCategory;
