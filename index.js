require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const setupSwagger = require("./config/swaggerConfig");
const cors = require('cors');

// Routes
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Swagger setup
setupSwagger(app);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Running server on http://localhost:${PORT}`);
});
