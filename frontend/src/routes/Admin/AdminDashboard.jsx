import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [allBrands, setAllBrands] = useState([]);

  const { token } = useSelector((state) => state.token);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await axios.get("http://localhost:3001/api/v1/brands");
      setAllBrands(data);
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(
        "http://localhost:3001/api/v1/user/getAllUsersInfo",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(
        "http://localhost:3001/api/v1/categories"
      );
      setAllCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("http://localhost:3001/api/v1/products");
      setAllProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const fetchMyOrders = async () => {
        const { data } = await axios.get(
          "http://localhost:3001/api/v1/orders/getAllOrders",
          config
        );
        setOrders(data);
      };
      fetchMyOrders();
    } catch (error) {
      throw new Error(error);
    }
  }, []);

  return (
    <div className="flex justify-center items-center bg-[#D9D9D9] py-28 gap-10 flex-col">
      <h1 className="text-4xl ">Admin Dashboard</h1>
      <div className="font-light text-lg  flex max-w-2xl gap-4">
        <div className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Products</h2>
          <p className="text-2xl flex justify-center">{allProducts.length}</p>
        </div>
        <div className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Categories</h2>
          <p className="text-2xl flex justify-center">{allCategories.length}</p>
        </div>
        <div className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Brands</h2>
          <p className="text-2xl flex justify-center">{allBrands.length}</p>
        </div>
        <div className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Orders</h2>
          <p className="text-2xl flex justify-center">{orders.length}</p>
        </div>
        <div className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Users</h2>
          <p className="text-2xl flex justify-center">{users.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
