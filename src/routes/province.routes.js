const { Router } = require('express');
const { getAllProvince } = require('../controllers/province.controller');

const router = Router();

router.get('/province', getAllProvince);

module.exports = router;