const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

exports.createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress, items } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'user no found' });

        let subtotal = 0;
        const orderItems = await Promise.all(items.map(async item => {
            const product = await Product.findById(item.id);
            if (!product) throw new Error(`Product ID ${item.product} no found in DB`);

            const totalPrice = product.price * item.quantity;
            subtotal += totalPrice;

            return {
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            };
        }));

        const tax = subtotal * 0.16;
        const total = subtotal + tax;

        const order = new Order({
            user: user._id,
            shippingAddress,
            items: orderItems,
            subtotal,
            tax,
            total
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('items.product', 'description price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'description price');
        if (!order) return res.status(404).json({ message: 'Order no found.' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
