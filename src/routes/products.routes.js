const { Router } = require('express');
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');

const router = Router();

router.get('/products', getAllProducts);

router.get('/products/:id', getProduct);

router.post('/products', createProduct);

router.put('/products/:id', updateProduct);

router.delete('/products/:id', deleteProduct);

// router.get('/provinces', getAllProvinces);


module.exports = router;