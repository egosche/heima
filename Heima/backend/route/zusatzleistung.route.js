const express = require('express')
const router = express.Router()
const controller = require('../controller/zusatzleistung.controller');

// Retrieve a single zusatzleistung by id
router.get('/:id', controller.findById);

// Retrieve all zusatzleistung by zimmerid
router.get('/byZimmerID/:id', controller.findByZimmerId);

module.exports = router