import React, { useEffect, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import BrandModal from "../../components/Admin/Brand/BrandModal"; // Import the BrandModal component
import axios from "axios";
import DeleteBrandModal from "../../components/Admin/Brand/DeleteBrandModal";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { apiUrl } from "../../components/Product/ProductCard";

const AdminBrand = () => {
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [allBrands, setAllBrands] = useState([]);
  const [brandsToDisplay, setBrandsToDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perpage = 3;
  const [totalPages, setTotalPages] = useState(1);

  const toggleShowModal = () => {
    setShowModal(!showModal);
    document.body.classList.toggle("disable-scrolling");
  };

  const toggleUpdateShowModal = () => {
    setIsUpdate(!isUpdate);
    setShowModal(!showModal);
  };

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleSearchStringChange = (e) => {
    setSearchString(e.target.value);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await axios.get("http://localhost:3001/api/v1/brands");
      setAllBrands(data);
    };
    fetchBrands();
  }, [showModal, showDeleteModal]);

  useEffect(() => {
    const filteredData =
      searchString !== ""
        ? allBrands.filter((brand) =>
            brand.name.toLowerCase().includes(searchString.toLowerCase())
          )
        : allBrands;
    setTotalPages(Math.ceil(filteredData.length / perpage));
    setBrandsToDisplay(
      filteredData.slice(currentPage * perpage - perpage, currentPage * perpage)
    );
  }, [allBrands, currentPage, searchString]);

  return (
    <>
      {showModal && !isUpdate && (
        <BrandModal closeHandler={toggleShowModal} isAdd={true} />
      )}
      {showModal && isUpdate && (
        <BrandModal
          closeHandler={toggleUpdateShowModal}
          data={allBrands.find((brand) => brand.brand_id === idToUpdate)}
          isAdd={false}
        />
      )}
      {showDeleteModal && (
        <DeleteBrandModal
          closeHandler={toggleShowDeleteModal}
          id={idToUpdate}
        />
      )}

      <div className="pb-5 flex justify-between px-20">
        <h1 className="text-2xl font-medium">All Brands</h1>
        <div className="flex gap-x-3">
          <p
            className="p-2 bg-[#2c2c2c] px-4 rounded-md text-white cursor-pointer"
            onClick={toggleShowModal}
          >
            Add Brand
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

      <div className="px-4 md:px-20 pb-10 overflow-x-scroll">
        <table className="table-auto bg-[#2C2C2C] md:w-full">
          <thead className="rounded-lg">
            <tr>
              <th className="p-3 py-4 text-start text-white">S.N.</th>
              {/* <th className="p-3 py-4 text-start text-white">Image</th> */}
              <th className="p-3 py-4 text-start text-white">Name</th>
              <th className="p-3 py-4 text-center text-white">Options</th>
            </tr>
          </thead>
          <tbody>
            {brandsToDisplay.map((brand, index) => (
              <tr key={index} className="bg-white">
                <td className="p-3">{index + 1}</td>
                {/* <td className="p-3">
                  <img
                    src={`${apiUrl}${brand.imagePath}`}
                    alt="no image"
                    className="object-fill rounded-lg max-w-[100px]"
                  />
                </td> */}
                <td className="p-3">{brand.name}</td>
                <td className="p-3 flex justify-center gap-x-2">
                  <BiSolidEditAlt
                    onClick={() => {
                      setIdToUpdate(brand.brand_id);
                      toggleUpdateShowModal();
                    }}
                    className="size-5 cursor-pointer"
                  />
                  <MdDelete
                    onClick={() => {
                      setIdToUpdate(brand.brand_id);
                      toggleShowDeleteModal();
                    }}
                    className="size-5 text-red-500 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
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

export default AdminBrand;
