const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

//Authentification routes
router.use(authMiddleware);

//CRUD users
router.get('/', userController.getAllUsers);
router.get('/:email', userController.getUserByEmail);
router.post('/', userController.createUser);
router.put('/:email', userController.updateUser);
router.delete('/:email', userController.deleteUser);

module.exports = router;