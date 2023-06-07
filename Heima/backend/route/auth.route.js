const express = require('express')
const router = express.Router()
const controller = require('../controller/auth.controller');

// Retrieve JWT Tokens after login
router.get('/tokens/:userId', controller.getTokens);

// Retrieve new AccessToken after the old one expired
router.post('/newAccessToken', controller.getNewAccessToken)

// Authenticate a JWT Token
router.post('/', controller.authenticateToken);

// Deauthenticate a JWT Token
router.delete('/', controller.deauthenticateToken);

module.exports = router