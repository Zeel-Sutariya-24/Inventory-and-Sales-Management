const Customer = require("../models/Customers");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboard = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 5 },
    });

    const salesResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: "CANCELLED" },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalSales =
      salesResult.length > 0 ? salesResult[0].totalSales : 0;

    res.json({
      totalCustomers,
      totalProducts,
      totalOrders,
      totalSales,
      lowStockProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard data",
    });
  }
};

module.exports = {
  getDashboard,
};