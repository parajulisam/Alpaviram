import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const AdminDashboard = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("accessToken"); // Access token from localStorage

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/v1/brands");
        setAllBrands(data);
        console.log("Brands:", data); // Log the fetched brands data
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
        console.log("Users:", data); // Log the fetched users data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/v1/categories"
        );
        setAllCategories(data);
        console.log("Categories:", data); // Log the fetched categories data
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/v1/products"
        );
        setAllProducts(data);
        console.log("Products:", data); // Log the fetched products data
      } catch (error) {
        console.error("Error fetching products:", error);
      }
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
        console.log("Orders:", data); // Log the fetched orders data
      };
      fetchMyOrders();
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [token]);
  return (
    <div className="flex justify-center items-center bg-[#D9D9D9] py-28 gap-10 flex-col">
      <h1 className="text-4xl">Admin Dashboard</h1>
      <div className="font-light text-lg flex max-w-2xl gap-4">
        <Link to="/admin/products" className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Products</h2>
          <p className="text-2xl flex justify-center">{allProducts.length}</p>
        </Link>
        <Link to="/admin/category" className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Categories</h2>
          <p className="text-2xl flex justify-center">{allCategories.length}</p>
        </Link>
        <Link to="/admin/brands" className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Brands</h2>
          <p className="text-2xl flex justify-center">{allBrands.length}</p>
        </Link>
        <Link to="/admin/orders" className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Orders</h2>
          <p className="text-2xl flex justify-center">{orders.length}</p>
        </Link>
        <Link to="/admin/users" className="px-6 py-3 bg-white">
          <h2 className="text-2xl mb-2 font-medium">Users</h2>
          <p className="text-2xl flex justify-center">{users.length}</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
