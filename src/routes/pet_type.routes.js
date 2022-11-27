const { Router } = require('express');
const { getAllTypePet } = require('../controllers/pet_type.controller');

const router = Router();

router.get('/pet-type', getAllTypePet)

module.exports = router;