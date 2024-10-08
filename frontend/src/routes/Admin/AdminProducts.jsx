import React, { useEffect, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { DropdownTableRow } from "../../components/Admin/Common/DropdownTableRow";
import ProductModal from "../../components/Admin/Product/ProductModal";
import axios from "axios";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import DeleteProductModal from "../../components/Admin/Product/DeleteProductModal";

const AdminProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState(0);

  const toggleShowModal = () => {
    setShowModal(!showModal);
    setIsUpdate(false); // Set to false when adding a new product
    if (showModal === false) {
      document.body.classList.add("disable-scrolling");
    } else {
      document.body.classList.remove("disable-scrolling");
    }
  };

  const toggleUpdateShowModal = (id) => {
    setIsUpdate(true); // Set to true when updating a product
    setIdToUpdate(id);
    setShowModal(!showModal);
    if (showModal === false) {
      document.body.classList.add("disable-scrolling");
    } else {
      document.body.classList.remove("disable-scrolling");
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleShowDeleteModal = (id) => {
    setIdToUpdate(id);
    setShowDeleteModal(!showDeleteModal);
  };

  const [searchString, setSearchString] = useState("");
  const handleSearchStringChange = (e) => {
    setSearchString(e.target.value);
  };

  const [allProducts, setAllProducts] = useState([]);
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perpage = 3;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/v1/products"
        );
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [showModal, showDeleteModal]);

  useEffect(() => {
    const filteredProducts = searchString
      ? allProducts.filter((product) =>
          product.name.toLowerCase().includes(searchString.toLowerCase())
        )
      : allProducts;
    setTotalPages(Math.ceil(filteredProducts.length / perpage));
    setProductsToDisplay(
      filteredProducts.slice(
        currentPage * perpage - perpage,
        currentPage * perpage
      )
    );
  }, [allProducts, currentPage, searchString]);

  return (
    <>
      <div className="pb-5 flex justify-between px-20">
        {showModal && !isUpdate && (
          <ProductModal closeHandler={toggleShowModal} isAdd={true} />
        )}
        {showDeleteModal && (
          <DeleteProductModal
            closeHandler={toggleShowDeleteModal}
            id={idToUpdate}
          />
        )}
        {showModal && isUpdate && (
          <ProductModal
            closeHandler={toggleUpdateShowModal}
            data={allProducts.find(
              (product) => product.product_id === idToUpdate
            )}
            isAdd={false}
          />
        )}
        <h1 className="text-2xl font-medium">All products</h1>
        <div className="flex gap-x-3">
          <p
            className="p-2 bg-[#2c2c2c] px-4 rounded-md text-white cursor-pointer"
            onClick={toggleShowModal} // Open modal for adding product
          >
            Add Product
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

      <div className="px-4 md:px-20 pb-10 overflow-x-scroll ">
        <table className="table-auto bg-[#2C2C2C] md:w-full ">
          <thead className="rounded-lg">
            <tr>
              <th></th>
              <th className="p-3 py-4 text-start text-white">S.N.</th>
              <th className="p-3 py-4 text-start text-white">Name</th>
              <th className="p-3 py-4 text-start text-white">Price</th>
              <th className="p-3 py-4 text-start text-white">In Stock</th>
              <th className="p-3 py-4 text-start text-white">Category ID</th>
              <th className="p-3 py-4 text-start text-white">Brand ID</th>
              <th className="p-3 py-4 text-start text-white">Photo</th>
              <th className="p-3 py-4 text-center text-white">Options</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {productsToDisplay.map((product, index) => {
              return (
                <DropdownTableRow
                  key={product.product_id}
                  colSpanNumber={8}
                  remainingTableRows={
                    <>
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.price}</td>
                      <td className="p-3">{product.countInStock}</td>
                      <td className="p-3">{product.category_id || "N/A"}</td>
                      <td className="p-3">{product.brand_id || "N/A"}</td>
                      <td className="p-3">
                        <img
                          src={`http://localhost:3001${product.imagePath}`}
                          alt={product.name}
                          className="object-fill rounded-lg max-w-[50px]"
                        />
                      </td>
                      <td className="p-3">
                        <div className="justify-center flex gap-x-2">
                          <BiSolidEditAlt
                            onClick={() => {
                              setIdToUpdate(product.product_id);
                              toggleUpdateShowModal(product.product_id);
                            }}
                            className="size-5 cursor-pointer"
                          />
                          <MdDelete
                            className="size-5 text-red-500 cursor-pointer"
                            onClick={() => {
                              setIdToUpdate(product.product_id);
                              toggleShowDeleteModal(product.product_id);
                            }}
                          />
                        </div>
                      </td>
                    </>
                  }
                  dropdownDiv={
                    <div className="p-2 bg-gray-100">
                      <div className="flex gap-x-3">
                        <img
                          src={`http://localhost:3001${product.imagePath}`}
                          alt="no image"
                          className="object-fill rounded-lg max-w-[300px]"
                        />
                        <div>
                          <p>
                            <strong>Rating: </strong>
                            {product.rating}
                          </p>
                          <p>{product.description}</p>
                        </div>
                      </div>
                    </div>
                  }
                />
              );
            })}
          </tbody>
        </table>
        <div className="w-full bg-gray-200 p-2 flex justify-end gap-x-2">
          <div
            className={`px-2 bg-white rounded-sm text-xs shadow-sm py-1 cursor-pointer ${
              currentPage - 1 < 1 && "hidden"
            }`}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {currentPage - 1}
          </div>
          <div
            className="px-2 bg-black text-white rounded-sm text-xs shadow-sm py-1 cursor-pointer"
            onClick={() => setCurrentPage(currentPage)}
          >
            {currentPage}
          </div>
          <div
            className={`px-2 bg-white rounded-sm text-xs shadow-sm py-1 cursor-pointer ${
              currentPage + 1 > totalPages && "hidden"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {currentPage + 1}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProducts;
