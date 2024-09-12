import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const khaltiPay = async (req, res) => {
  const { token, amount } = req.body;

  // Log the request body to ensure token and amount are received
  // console.log("Request body:", req.body);

  if (!token || !amount) {
    return res.status(400).json({
      success: false,
      message: "Token and amount are required",
    });
  }

  try {
    const khaltiresponse = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `Key test_secret_key_3722fd6257b84dab8251b1af3dbecd37`,
        },
      }
    );

    if (khaltiresponse && khaltiresponse.data) {
      res.json({
        success: true,
        data: khaltiresponse.data,
      });
    } else {
      res.json({
        success: false,
        message: "No data received from Khalti",
      });
    }
  } catch (error) {
    console.error(
      "Error verifying Khalti payment:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

export { khaltiPay };
