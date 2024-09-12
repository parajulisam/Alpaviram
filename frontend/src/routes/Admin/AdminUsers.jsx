import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  // Access token from localStorage
  const token = localStorage.getItem("accessToken");

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
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  return (
    <div className="flex justify-center items-center bg-[#D9D9D9] py-10 gap-10 flex-col">
      <h1 className="text-4xl">Users</h1>
      <div className="font text-lg px-10 xl:w-screen">
        <table className="table-auto bg-[#2C2C2C] md:w-full">
          <thead className="rounded-lg">
            <tr>
              <th className="p-3 py-4 text-center text-white">S.N.</th>
              <th className="p-3 py-4 text-center text-white">Name</th>
              <th className="p-3 py-4 text-center text-white">Contact</th>
              <th className="p-3 py-4 text-center text-white">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user, index) => (
              <tr key={user._id}>
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3 text-center">{user.first_name}</td>
                <td className="p-3 text-center">{user.contact_number}</td>
                <td className="p-3 text-center">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
