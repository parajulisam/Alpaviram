import React, { useEffect, useState } from "react";
import axios from "axios";
import { DropdownTableRow } from "../../components/Admin/Common/DropdownTableRow";
import { IoClose, IoSearch } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [searchString, setSearchString] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersToDisplay, setOrdersToDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [reFetch, setReFetch] = useState(false);
  const [error, setError] = useState(null); // Error state

  // Fetch the token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Retrieve the token from localStorage

        if (!accessToken) {
          throw new Error("No token found"); // Throw an error if the token is missing
        }

        // Log the token
        console.log("Fetching orders with token:", accessToken);

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const { data } = await axios.get(
          "http://localhost:3001/api/v1/orders/getAllOrders",
          config
        );
        setOrders(data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Failed to fetch orders:", error); // Log errors
        setError(error.message); // Set error state
      }
    };

    fetchOrders();
  }, [reFetch]);

  useEffect(() => {
    if (searchString !== "") {
      const searchedData = orders.filter((order) =>
        order.order_id.toString().includes(searchString)
      );
      setTotalPages(Math.ceil(searchedData.length / perPage));
      setCurrentPage(1);
      setOrdersToDisplay(
        searchedData.slice(
          currentPage * perPage - perPage,
          currentPage * perPage
        )
      );
    } else {
      setTotalPages(Math.ceil(orders.length / perPage));
      setOrdersToDisplay(
        orders.slice(currentPage * perPage - perPage, currentPage * perPage)
      );
    }
  }, [orders, currentPage, searchString]);

  const changeStatus = async (id, status) => {
    try {
      // Fetch the access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No token found");
      }

      // Configure headers for the API request
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use the token here
        },
      };

      // Make the API request to update the order status
      await axios.put(
        `http://localhost:3001/api/v1/orders/${id}`,
        { status },
        config
      );

      // Notify the user of success
      toast.success(`Order ${status}`, {
        position: "top-right",
        style: { backgroundColor: "black", color: "white" },
      });

      // Trigger a refetch to update the orders list
      setReFetch(!reFetch);
    } catch (error) {
      // Log errors and notify the user
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status", {
        position: "top-right",
        style: { backgroundColor: "black", color: "white" },
      });
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>; // Display error message if there's an error
  }

  return (
    <div className="max-w-4xl mx-auto my-6 min-h-[50vh]">
      <div className="flex gap-x-3 justify-end mb-3">
        <div className="min-w-[250px] bg-[#D9D9D9] p-5 rounded-md relative">
          <IoSearch className="absolute left-2 top-3 size-4" />
          <IoClose className="absolute right-2 top-3 size-4" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchString(e.target.value)}
            className="absolute top-1 left-8 p-1 pb-0 bg-[#D9D9D9] placeholder:text-[#686868] focus:border-none outline-none"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto bg-[#2C2C2C] md:w-full">
          <thead className="rounded-lg">
            <tr>
              <th></th>
              <th className="p-3 py-4 text-center text-white">Order ID</th>
              <th className="p-3 py-4 text-center text-white">Date</th>
              <th className="p-3 py-4 text-center text-white">Total</th>
              <th className="p-3 py-4 text-center text-white">Payment Type</th>
              <th className="p-3 py-4 text-center text-white">Order Status</th>
            </tr>
          </thead>
          <tbody className="bg-white text-center">
            {ordersToDisplay.map((order, index) => (
              <DropdownTableRow
                key={index}
                colSpanNumber={6}
                remainingTableRows={
                  <>
                    <td className="p-3">{order.order_id}</td>
                    <td className="p-3">{order.createdAt.substr(0, 10)}</td>
                    <td className="p-3">NPR. {order.total_amount}</td>
                    <td className="p-3">{order.payment_method}</td>
                    <td className="p-3">{order.status}</td>
                  </>
                }
                dropdownDiv={
                  <div className="py-4 px-8 bg-gray-100">
                    <div className="flex justify-between px-3 text-xl">
                      <p>
                        Order #{order.order_id} was placed on (
                        {order.createdAt.substr(0, 10)})
                      </p>
                      {order.status !== "Delivered" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              changeStatus(order.order_id, "Delivered")
                            }
                            className="text-sm text-white font-medium md:block bg-[#2C2C2C] px-4 py-1 rounded-sm hover:bg-white border hover:border-black hover:text-black transition-all duration-500"
                          >
                            Mark As Delivered
                          </button>
                          <button
                            onClick={() =>
                              changeStatus(order.order_id, "Cancelled")
                            }
                            className="text-sm text-white font-medium md:block bg-red-500 px-4 py-1 rounded-sm hover:bg-white border hover:border-black hover:text-black transition-all duration-500"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="border border-gray-400 rounded-md my-4 px-4 bg-white">
                      <h2 className="head font-medium my-4 text-start text-2xl">
                        Your Order
                      </h2>
                      <div className="body space-y-4 text-sm">
                        <div className="subtotal text-lg flex justify-between">
                          <p className="">Product</p>
                          <p className="">Sub Total</p>
                        </div>
                        <hr className="border border-neutral-400" />
                        {order.products.map((product) => (
                          <div
                            key={product.product_id}
                            className="shipping grid grid-cols-3 justify-between"
                          >
                            <p className="col-span-2 text-start">
                              {product.name} x {product.order_line.quantity}
                            </p>
                            <p className="text-right">
                              NPR {product.price * product.order_line.quantity}{" "}
                              /-
                            </p>
                          </div>
                        ))}
                        <hr className="border border-neutral-400 " />
                        <div className="grand total flex justify-between my-8 pb-4">
                          <p className="text-lg xl:text-xl">Grand Total</p>
                          <p className="text-lg xl:text-xl">
                            NPR {order.total_amount} /-
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="head font-medium my-4 text-start text-xl">
                        Payment Method: {order.payment_method}
                      </h2>
                      <div
                        className="bg-green-100 flex items-center gap-x-2 border border-red-200 px-4 py-2 text-start rounded-sm relative"
                        role="alert"
                      >
                        {order.is_paid === 1 ? (
                          <>
                            <strong className="font-bold ">
                              <MdErrorOutline />
                            </strong>
                            <span className="block sm:inline"> Paid !</span>
                          </>
                        ) : (
                          <>
                            <strong className="font-bold ">
                              <MdErrorOutline />
                            </strong>
                            <span className="block sm:inline"> Not Paid !</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <h2 className="head font-medium my-4 text-start text-xl">
                        Shipping Address
                      </h2>
                      <div className="text-left border px-6 py-4 bg-white">
                        <p className="font-medium text-lg mb-2">
                          {order.shipping_address.first_name}
                        </p>
                        <p className="text-gray-600 mb-1">
                          Email: {order.shipping_address.email}
                        </p>
                        <p className="text-gray-600 mb-1">
                          Phone: {order.shipping_address.contact_number}
                        </p>
                        <p className="text-gray-600 mb-1">
                          City: {order.shipping_address.city}
                        </p>
                        <p className="text-gray-600 mb-1">
                          Postal Code: {order.shipping_address.postal_code}
                        </p>
                        <p className="text-gray-600 mb-1">
                          Street Address: {order.shipping_address.street}
                        </p>
                        <p className="text-gray-600">
                          Province: {order.shipping_address.province}
                        </p>
                      </div>
                      <div
                        className="bg-gray-300 flex items-center gap-x-2 border border-gray-400 px-4 py-2 my-4 text-start rounded-sm relative"
                        role="alert"
                      >
                        {order.status !== "Delivered" ? (
                          <strong className="font-bold ">
                            <MdErrorOutline />
                          </strong>
                        ) : (
                          <TbTruckDelivery />
                        )}
                        <span className="block sm:inline">
                          {" "}
                          {order.status} !
                        </span>
                      </div>
                    </div>
                  </div>
                }
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="pagination flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
