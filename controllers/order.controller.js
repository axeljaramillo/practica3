const Order = require('../models/order.model');

// POST /api/orders/ - Create order (authenticated)
exports.createOrder = async (req, res) => {
    try {
        const { products, total } = req.body;

        const order = new Order({
            userId: req.user._id,
            products,
            total,
            date: new Date()
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/orders/ - Get orders for authenticated user
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate('products', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/orders/:id - Get order by ID (owner only)
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products', 'name price');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.user._id !== order.userId.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


