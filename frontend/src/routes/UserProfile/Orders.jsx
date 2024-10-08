import React, { useEffect, useState } from "react";
import { DropdownTableRow } from "../../components/Admin/Common/DropdownTableRow";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete, MdErrorOutline } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        // Retrieve the access token from localStorage
        const token = localStorage.getItem("accessToken");
        console.log("Fetching orders with token:", token); // Log the token

        // Configure the request headers
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // Make the API request
        const { data } = await axios.get(
          "http://localhost:3001/api/v1/orders/myorders",
          config
        );
        console.log("Orders data received:", data); // Log the received data
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error); // Log errors
        setError(error.message); // Set error state
      }
    };

    fetchMyOrders();
  }, []); // Empty dependency array ensures this runs once on component mount

  if (error) {
    return <div className="error">Error: {error}</div>; // Display error message if there's an error
  }

  return (
    <div className="max-w-4xl mx-auto my-6">
      <div className="overflow-x-auto">
        <table className="table-auto bg-[#2C2C2C] md:w-full">
          <thead className="rounded-lg">
            <tr>
              <th></th>
              <th className="p-3 py-4 text-center text-white">Order ID</th>
              <th className="p-3 py-4 text-center text-white">Date</th>
              <th className="p-3 py-4 text-center text-white">Total</th>
              <th className="p-3 py-4 text-center text-white">Payment Type</th>
            </tr>
          </thead>
          <tbody className="bg-white text-center">
            {orders.map((order, index) => (
              <DropdownTableRow
                key={index}
                colSpanNumber={6}
                remainingTableRows={
                  <>
                    <td className="p-3">{order.order_id}</td>
                    <td className="p-3">{order.createdAt.substr(0, 10)}</td>
                    <td className="p-3">NPR. {order.total_amount}</td>
                    <td className="p-3">{order.payment_method}</td>
                  </>
                }
                dropdownDiv={
                  <div className="py-4 px-8 bg-gray-100">
                    <div className="flex justify-between px-3 text-xl">
                      <p>
                        Order #{order.order_id} was placed on (
                        {order.createdAt.substr(0, 10)})
                      </p>
                      <p className="text-base">
                        Status:{" "}
                        <span className="px-2 py-2 bg-white rounded-2xl">
                          {order.status}
                        </span>
                      </p>
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

                        {/* Loop through products */}
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

                        {/* Display Grand Total */}
                        <div className="grand total flex justify-between my-8 pb-4">
                          <p className="text-lg xl:text-xl">Grand Total</p>
                          <p className="text-lg xl:text-xl">
                            NPR {order.total_amount} /-
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h2 className="head font-medium my-4 text-start text-xl">
                        Payment Method: {order.payment_method}
                      </h2>
                      <div
                        className="bg-gray-300 flex items-center gap-x-2 border border-gray-400 px-4 py-2 my-4 text-start rounded-sm relative"
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

                    {/* Shipping Address */}
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
    </div>
  );
};

export default Orders;
