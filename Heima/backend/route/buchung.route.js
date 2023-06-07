const express = require('express')
const router = express.Router()
const controller = require('../controller/buchung.controller');

// Retrieve a single buchung by id
router.get('/:id', controller.findById);

// Retrieve all buchung by vermieterid
router.get('/byVermieterID/:id', controller.findByVermieterId);

// Retrieve all buchung by benutzerid
router.get('/byBenutzerID/:id', controller.findByBenutzerId);

// Create a new buchung
router.post('/', controller.create);

// Update a buchung
router.put('/', controller.update);

// Patch the status of a buchung
router.patch('/status', controller.patchStatus);

module.exports = router