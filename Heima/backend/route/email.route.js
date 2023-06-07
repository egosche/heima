const express = require('express')
const router = express.Router()
const controller = require('../controller/email.controller');

// Create a new email
router.post('/', controller.create);

module.exports = router