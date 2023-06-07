const express = require('express')
const router = express.Router()
const controller = require('../controller/bewertung.controller');

// Retrieve a single bewertung by id
router.get('/:id', controller.findById);

// Retrieve all bewertung by buchungid
router.get('/byBuchungID/:id', controller.findByBuchungId);

// Create a new bewertung
router.post('/', controller.create);

// Retrieve all bewertungen
router.get('/', controller.findAll);

/* Update a bewertung
router.put('/', controller.update);*/

module.exports = router