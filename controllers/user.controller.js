const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// POST /api/users/ - Create User (anyone)
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// POST /api/users/login - Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/users/ - Get all users (admin only)
exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// GET /api/users/:id - Get user by ID (admin or owner)
exports.getUserById = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user._id !== req.params.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT /api/users/:id - Update user (admin or owner)
exports.updateUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user._id !== req.params.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /api/users/:id - Delete user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
