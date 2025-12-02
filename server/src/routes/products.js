const express = require('express');
const router = express.Router();
const { addProduct, getProducts, deleteProduct } = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken); // Protect all product routes

router.post('/', addProduct);
router.get('/', getProducts);
router.delete('/:id', deleteProduct);

module.exports = router;
