import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function useBrand() {
  const [formData, setFormData] = useState({
    name: "",
    imagePath: "",
  });

  const { name, imagePath } = formData;
  const [update, setUpdate] = useState(false);

  const [oldImagePath, setOldImagePath] = useState("");

  const { token } = useSelector((state) => state.token);

  const addBrand = async (formData) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/v1/brands",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      toast.error(error.response.data.message);
      return null;
    }
  };

  const updateBrand = async (formData, id) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3001/api/v1/brands/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

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
    } catch (error) {
      console.error("Error updating brand:", error);
      return null;
    }
  };

  const getImagePath = async (file) => {
    if (imagePath !== "" && imagePath !== oldImagePath) {
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

      updatedFormData = {
        ...formData,
        imagePath: await getImagePath(files[0]),
      };
    } else {
      updatedFormData = {
        ...formData,
        [event.target.name]: event.target.value,
      };
    }
    setFormData(updatedFormData);
  };

  const onSubmit = async (event, id) => {
    event.preventDefault();
    try {
      let response;
      if (id) {
        response = await updateBrand(formData, id);
        toast.success("Brand updated successfully", {
          position: "top-right",
          style: { backgroundColor: "black", color: "white" },
        });
      } else {
        response = await addBrand(formData);
        toast.success("Brand added successfully", {
          position: "top-right",
          style: { backgroundColor: "black", color: "white" },
        });
      }
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  };

  return {
    name,
    imagePath,
    onSubmit,
    handleChange,
    setFormData,
    setUpdate,
    setOldImagePath,
  };
}
