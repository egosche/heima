const express = require('express')
const router = express.Router()
const controller = require('../controller/user.controller');

// Retrieve a single User by id
router.get('/byID/:id', controller.findById);

//Create a new User
router.post('/', controller.create);

//Find User by Email
router.post('/byEmail', controller.findByEmail)

module.exports = router