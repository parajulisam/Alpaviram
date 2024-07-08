import axios from "axios";

const khaltiPay = async (req, res) => {
  //   let data = {
  //     token: req.params.token,
  //     amount: req.params.amount,
  //   };
  const payload = req.body;

  let config = {
    headers: {
      Authorization: `Key 0768f77a4f0e4806a0974c2233c6bc24`,
    },
  };

  console.log(req.body);
  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    payload,
    config
  );

  res.send(response.data);
  //   console.log(response.data);
};

export { khaltiPay };
