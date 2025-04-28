const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');


//Public routers
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/', authMiddleware, userController.getUsers);

router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);


module.exports = router;
