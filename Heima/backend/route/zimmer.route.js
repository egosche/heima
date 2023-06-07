const express = require('express')
const router = express.Router()
const controller = require('../controller/zimmer.controller');

// Retrieve a single zimmer by id
router.get('/:id', controller.findById);

// Retrieve a single zimmer by vermieterid
router.get('/byVermieterID/:id', controller.findByVermieterId)

// Retrieve matching zimmers by params
router.post('/search', controller.findByParams);

// Retrieve all zimmers
router.get('/', controller.findAll);

// Create a new zimmer
router.post('/', controller.create);

// Update a zimmer
router.put('/', controller.update);

// Delete a zimmer by id
router.delete('/:id', controller.delete);

module.exports = router