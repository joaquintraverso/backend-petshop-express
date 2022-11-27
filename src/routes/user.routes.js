const { Router } = require('express');
const { getAllUser, getUser, createUser, updateUser } = require('../controllers/user.controller');

const router = Router();

router.get('/user', getAllUser);

router.get('/user/:id', getUser);

router.post('/user', createUser);

router.put('/user/:id', updateUser);

module.exports = router;