const mongoose = require("mongoose");
const Order = require("../models/Order");
const Customer = require("../models/Customers");
const Product = require("../models/Product");
const { orderSchema } = require("../src/validators/orderValidator");

const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const result = orderSchema.parse(req.body);

        session.startTransaction();

        // Check customer
        const customer = await Customer.findById(result.customer).session(session);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const orderItems = [];
        let orderTotal = 0;

        // Process each product
        for (const item of result.items) {
            const product = await Product.findById(item.product).session(session);

            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }

            // Check stock
            if (item.quantity > product.stock) {
                throw new Error(
                    `Insufficient stock for ${product.name}. Available stock: ${product.stock}`
                );
            }

            // Use price from database
            const unitPrice = product.price;

            // Calculate line total on server
            const lineTotal = unitPrice * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                unitPrice,
                lineTotal,
            });

            orderTotal += lineTotal;

            // Reduce stock
            product.stock -= item.quantity;

            await product.save({ session });
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}`;

        const [order] = await Order.create(
            [
                {
                    orderNumber,
                    customer: customer._id,
                    items: orderItems,
                    totalAmount: orderTotal,
                    status: "CONFIRMED",
                },
            ],
            { session }
        );

        await session.commitTransaction();

        res.status(201).json({
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        await session.abortTransaction();

        console.error(error);

        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.flatten().fieldErrors,
            });
        }

        res.status(400).json({
            message: error.message || "Failed to create order",
        });
    } finally {
        session.endSession();
    }
};

const cancelOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const order = await Order.findById(req.params.id).session(session);

        if (!order) {
            throw new Error("Order not found");
        }

        // Prevent cancelling the same order twice
        if (order.status === "CANCELLED") {
            throw new Error("Order is already cancelled");
        }

        // Only confirmed orders can be cancelled
        if (order.status !== "CONFIRMED") {
            throw new Error("Only confirmed orders can be cancelled");
        }

        // Restore stock for every product
        for (const item of order.items) {
            const product = await Product.findById(item.product).session(session);

            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }

            product.stock += item.quantity;

            await product.save({ session });
        }

        // Mark order as cancelled
        order.status = "CANCELLED";

        await order.save({ session });

        await session.commitTransaction();

        res.json({
            message: "Order cancelled successfully",
            order,
        });
    } catch (error) {
        await session.abortTransaction();

        console.error(error);

        res.status(400).json({
            message: error.message || "Failed to cancel order",
        });
    } finally {
        session.endSession();
    }
};

const getOrders = async (req, res) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        let query = {};

        if (search) {
            const matchingCustomers = await Customer.find({
                name: {
                    $regex: search,
                    $options: "i",
                },
            }).select("_id");

            const customerIds = matchingCustomers.map(
                (customer) => customer._id
            );

            query = {
                $or: [
                    {
                        orderNumber: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        customer: {
                            $in: customerIds,
                        },
                    },
                ],
            };
        }

        const orders = await Order.find(query)
            .populate("customer", "name phone email")
            .populate("items.product", "name sku price")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments(query);

        const totalPages = Math.ceil(totalOrders / limit);

        res.json({
            orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch orders",
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customer", "name phone email")
            .populate("items.product", "name sku price");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        res.json({
            order,
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: "Invalid order ID",
        });
    }
};

module.exports = {
    createOrder,
    cancelOrder,
    getOrders,
    getOrderById,
};