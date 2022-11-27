const { Router } = require('express');
const { getAllServices, getService, createService, updateService, deleteService } = require('../controllers/service.controller')

const router = Router();

router.get('/service',getAllServices);

router.get('/service/:id',getService);

router.post('/service', createService);

router.put('/service/:id', updateService)

router.delete('/service/:id', deleteService)

module.exports = router;