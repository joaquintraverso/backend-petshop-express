const { Router } = require('express');
const { getAllLocation } = require('../controllers/location.controller');

const router = Router();

router.get('/location', getAllLocation)

module.exports = router;