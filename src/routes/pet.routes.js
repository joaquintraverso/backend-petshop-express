const { Router } = require('express');
const { getPet, createPet, getAllPets, deletePet } = require('../controllers/pet.controller');

const router = Router();

router.get('/pet', getAllPets);

router.get('/pet/:id', getPet);

router.post('/pet', createPet);

router.delete('/pet/:id', deletePet);

module.exports = router;