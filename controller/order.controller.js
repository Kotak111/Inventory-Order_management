const Order = require("../models/order.model");
const Product = require("../models/product.model");

exports.PlaceOrder = async (req, res) => {
    const { orderItems } = req.body;

    // Check if orderItems is provided and is an array
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({ message: 'No items in the order' });
    }

    try {
        // Calculate total price
        let totalPrice = 0;
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            totalPrice += product.price * item.quantity;
        }

        // Create the order
        const order = new Order({
            user: req.user._id,  // From the authenticated user
            orderItems,
            totalPrice,
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Get order details by ID
exports.getOrderById = async (req, res) => {
    const  orderId  = req.params.id;

    console.log("Fetching order with ID:", orderId); // Debugging log

    try {
        const order = await Order.findById(orderId).populate("user").populate("orderItems.product");

        if (!order) {
            console.log("Order not found for ID:", orderId); // Debugging log
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
// Update order status
exports.updateOrderStatus = async (req, res) => {
    const  orderId  = req.params.id;
    const { status } = req.body;

    // Validate the status value
    const validStatuses = ["Pending", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid order status" });
    }

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update the status
        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
// Get all orders for a specific customer
exports.getAllOrdersByUser = async (req, res) => {
    const userId = req.user._id; 
    try {
       
        const orders = await Order.find({ user: userId })
            .populate("orderItems.product", "name price") 
            .populate("user", "name email"); 

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
