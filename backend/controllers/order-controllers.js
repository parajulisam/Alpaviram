import db from "../models/index.js";

const Order = db.order;
const Product = db.product;
const OrderLine = db.orderLine;
const ShippingAddress = db.shippingAddress;

// @desc    Get Order by ID
// @route   GET api/v1/orders/:id
// @access  Private
const getOrderByID = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({
      where: {
        order_id: orderId,
        // If you want to ensure that only the user's orders are fetched,
        // you can also add user_id in the where clause:
        // user_id: userId,
      },
      attributes: {
        exclude: ["shipping_address_id"],
      },
      include: [
        {
          model: Product,
          attributes: ["product_id"], // Assuming you want to include name and price here
          through: {
            attributes: [
              "orderline_id",
              "quantity",
              "line_total",
              "name",
              "price",
            ],
          },
        },
        {
          model: ShippingAddress,
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: `Order with the given Order ID: "${orderId}" not found!`,
      });
    }

    if (order.user_id != userId) {
      return res.status(403).json({
        message: `The order with the given Order ID: "${orderId}" is not yours!`,
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while fetching the order.",
    });
  }
};
// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: {
        user_id: userId,
      },

      attributes: {
        exclude: ["user_id", "shipping_address_id"],
      },

      order: [["createdAt", "DESC"]],

      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "price"],

          through: {
            attributes: ["orderline_id", "quantity"],
          },
        },
        {
          model: ShippingAddress,
        },
      ],
    });

    res.json(orders);
  } catch (error) {
    throw new Error("Could not get your orders. Try again!");
  }
};

// @desc    To create order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, total_amount } = req.body;
    const {
      city,
      postalCode,
      street,
      province,
      firstName,
      lastName,
      contact,
      email,
    } = shippingAddress;

    console.log("Request Body:", req.body);
    console.log("Shipping Address:", shippingAddress);

    // Ensure the user ID is available and valid
    const userId = req.user?.id; // Adjusted to use `user_id`
    console.log(userId);
    if (!userId) {
      console.error("User ID is not provided.");
      return res.status(400).json({ message: "User ID is required." });
    }

    console.log("User ID:", userId);

    // Create new shipping address
    const newShippingAddress = {
      city,
      postal_code: postalCode,
      street,
      province,
      first_name: firstName,
      last_name: lastName,
      contact_number: contact,
      email,
    };
    console.log("New Shipping Address Data:", newShippingAddress);

    const createdShippingAddress = await ShippingAddress.create(
      newShippingAddress
    );
    console.log("Created Shipping Address:", createdShippingAddress);

    // Create Order
    const newOrder = {
      total_amount,
      is_paid: 0,
      is_delivered: 0,
      user_id: userId, // Ensure `user_id` is correctly assigned here
      shipping_address_id: createdShippingAddress.shipping_address_id,
      status: "Payment Pending",
    };
    console.log("New Order Data:", newOrder);

    const createdOrder = await Order.create(newOrder);
    console.log("Created Order:", createdOrder);

    // Create Order Lines
    const newOrderItems = orderItems.map((item) => ({
      order_id: createdOrder.order_id,
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
      line_total: item.qty * item.price,
    }));

    console.log("New Order Items Data:", newOrderItems);

    await OrderLine.bulkCreate(newOrderItems);
    console.log("Order Lines Created");

    // Update stock for each product
    for (const item of newOrderItems) {
      const product = await Product.findOne({
        where: { product_id: item.product_id },
      });

      if (product) {
        product.countInStock -= item.quantity;
        await product.save();
        console.log(
          `Updated stock for product ${item.product_id}:`,
          product.countInStock
        );
      } else {
        console.warn(`Product not found: ${item.product_id}`);
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    // Log the error and send a proper HTTP response with a status code and error message
    console.error("Order creation failed:", error);
    res
      .status(500)
      .json({ message: "Order creation failed. Please try again later." });
  }
};

// @desc    To update payment status (after user selects payment method)
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
const updatePayment = async (req, res) => {
  const orderId = req.params.id;
  const { payment_method, payment_id, amount } = req.body;

  console.log("Received request to update payment for order ID:", orderId);
  console.log("Request body:", req.body);

  try {
    // Find the order by its ID
    const order = await Order.findByPk(orderId);

    if (order) {
      console.log("Found order:", order);

      // Update the fields
      order.payment_method = payment_method || order.payment_method; // Update payment method if provided
      order.is_paid = 1; // Mark the order as paid
      order.paid_at = new Date(); // Set the payment date to now
      order.status = "Order Completed"; // Update status to "Order Completed"

      // Save the updated order
      const updatedOrder = await order.save();

      console.log("Updated order:", updatedOrder);
      res.json(updatedOrder); // Send back the updated order
    } else {
      console.error("Order not found for ID:", orderId);
      res.status(404).json({ message: "Order not found!" });
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    res
      .status(500)
      .json({ message: `Failed to update payment status: ${error.message}` }); // Include error message
  }
};

// @desc    To cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findByPk(orderId);

  if (order) {
    order.status = "Cancelled";

    const updatedOrder = await order.save();

    // Changing stock
    const orderStock = await Order.findOne({
      where: {
        order_id: orderId,
      },

      attributes: [],

      // include
      include: [
        {
          model: Product,
          attributes: ["product_id"],

          through: {
            attributes: ["quantity"],
          },
        },
      ],
    });

    const { products } = orderStock;

    // Updating stock
    for (const item of products) {
      const product = await Product.findOne({
        where: {
          product_id: item.product_id,
        },
      });

      if (product) {
        product.countInStock += item.order_line.quantity;

        await product.save();
      }
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found!");
  }
};

// @desc    Get all orders
// @route   PUT /api/orders
// @access  Private

const getOrders = async (req, res) => {
  console.log("getOrders function started"); // Log when function starts

  try {
    console.log("Fetching orders from database...");

    const orders = await Order.findAll({
      attributes: {
        exclude: ["shipping_address_id"],
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "price"],
          through: {
            attributes: ["orderline_id", "quantity", "line_total"],
          },
        },
        {
          model: ShippingAddress,
        },
      ],
    });

    console.log("Orders fetched successfully:", orders); // Log the fetched orders

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // Log any errors
    res.status(500).json({ error: "Orders could not be fetched!" });
  }
};

// @desc    To update order
// @route   PUT /api/v1/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const order = await Order.findByPk(orderId);

  if (order) {
    if (status === "Delivered") {
      order.is_delivered = 1;
      order.delivered_at = Date.now();

      if (order.payment_method === "COD") {
        order.is_paid = 1;
        order.paid_at = Date.now();
      }

      order.status = status;
    }

    if (status === "Cancelled") {
      order.status = status;

      // Changing stock
      const orderStock = await Order.findOne({
        where: {
          order_id: orderId,
        },

        attributes: [],

        // include
        include: [
          {
            model: Product,
            attributes: ["product_id"],

            through: {
              attributes: ["quantity"],
            },
          },
        ],
      });

      const { products } = orderStock;

      // Updating stock
      for (const item of products) {
        const product = await Product.findByPk(item.product_id);

        if (product) {
          product.countInStock += item.order_line.quantity;

          await product.save();
        }
      }
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found!");
  }
};

export {
  getOrderByID,
  getOrders,
  getMyOrders,
  createOrder,
  cancelOrder,
  updateOrder,
  updatePayment,
};
