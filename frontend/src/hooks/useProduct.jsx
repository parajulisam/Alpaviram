import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function useProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    imagePath: "",
    countInStock: 0,
    category_id: 0,
    brand_id: 0,
    featured: 0,
  });

  const [oldImagePath, setOldImagePath] = useState("");

  const {
    name,
    price,
    description,
    countInStock,
    imagePath,
    category_id,
    brand_id,
    featured,
  } = formData;

  const [update, setUpdate] = useState(false);

  const getImagePath = async (file) => {
    if (imagePath !== "" && imagePath !== oldImagePath) {
      console.log("Deleting old image path:", imagePath);
      await axios.post(
        "http://localhost:3001/api/v1/uploads/delete",
        { imagePath: imagePath },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    console.log("Uploading new image:", file);
    const { data } = await axios.post(
      "http://localhost:3001/api/v1/uploads",
      { image: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  };

  const handleChange = async (event) => {
    let updatedFormData = {};
    if (event.target.name === "image") {
      const files = event.target.files;
      console.log("Image file selected:", files[0]);
      updatedFormData = {
        ...formData,
        imagePath: await getImagePath(files[0]),
      };
    } else if (event.target.name === "featured") {
      updatedFormData = {
        ...formData,
        featured: event.target.checked ? 1 : 0,
      };
    } else {
      updatedFormData = {
        ...formData,
        [event.target.name]: event.target.value,
      };
    }
    console.log("Updated form data:", updatedFormData);
    setFormData(updatedFormData);
  };

  // Access token from localStorage
  const token = localStorage.getItem("accessToken");
  console.log(token);
  const addProduct = async (formData) => {
    console.log("Adding product with data:", formData);
    const { data } = await axios.post(
      "http://localhost:3001/api/v1/products",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token from localStorage
        },
        withCredentials: true,
      }
    );
    return data;
  };

  const updateProduct = async (formData, id) => {
    console.log("Updating product with id:", id, "and data:", formData);
    const { data } = await axios.put(
      `http://localhost:3001/api/v1/products/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token from localStorage
        },
        withCredentials: true,
      }
    );

    console.log("Deleting old image path:", oldImagePath);
    await axios.post(
      "http://localhost:3001/api/v1/uploads/delete",
      { imagePath: oldImagePath },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  };

  const onSubmit = async (event, id) => {
    event.preventDefault();
    try {
      let response;
      if (id) {
        console.log("Submitting update for product id:", id);
        response = await updateProduct(formData, id);
        toast.success("Product updated successfully", {
          position: "top-right",
          style: { backgroundColor: "black", color: "white" },
        });
      } else {
        console.log("Submitting new product");
        response = await addProduct(formData);
        toast.success("Product added successfully", {
          position: "top-right",
          style: { backgroundColor: "black", color: "white" },
        });
      }
      return true;
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error.response?.data || "An error occurred");
      return false;
    }
  };

  return {
    name,
    price,
    description,
    countInStock,
    category_id,
    brand_id,
    featured,
    imagePath,
    onSubmit,
    handleChange,
    setFormData,
    setUpdate,
    setOldImagePath,
  };
}
