const Router = require('express');
const { getAllAddress, createAddress, updateAddress, deleteAddress, getAddress } = require("../controllers/address.controller");



const router = Router();

router.get('/address', getAllAddress);
router.get('/address/:id', getAddress);
router.post('/address', createAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress)



module.exports = router;