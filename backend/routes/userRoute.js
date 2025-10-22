const express = require('express')
const { handleRegisterUser, handleUserLogin, handleUserLogout, handleCurrentUserProfile, fetchUser } = require('../controller/userController')
const apiRateLimiter = require('../middleware/rateLimiter')

const router = express.Router()

router.post('/create', apiRateLimiter, handleRegisterUser)
router.post('/login', apiRateLimiter, handleUserLogin)
router.post('/logout', apiRateLimiter, handleUserLogout)
router.get('/currentuser', fetchUser, handleCurrentUserProfile)

module.exports = router