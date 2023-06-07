const express = require('express')
const router = express.Router()
const controller = require('../controller/profil.controller');

// Retrieve a single profil by id
router.get('/:id', controller.findById);

// Retrieve the profil by besitzerid
router.get('/byBesitzerId/:id', controller.findByBesitzerId);

// Create a new profil
router.post('/', controller.create);

// Update a profil
router.put('/', controller.update);

module.exports = router