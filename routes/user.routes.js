const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public routes
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/', auth, role(['admin']), userController.getUsers);
router.get('/:id', auth, role(['admin', 'client']), userController.getUserById);
router.put('/:id', auth, role(['admin', 'client']), userController.updateUser);
router.delete('/:id', auth, role(['admin']), userController.deleteUser);

module.exports = router;
