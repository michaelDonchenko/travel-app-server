const { Router } = require('express')
const { register, login, logout } = require('../controllers/users')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const {
  registerValidation,
  loginValidation,
} = require('../validators/user-validators')
const { userAuth } = require('../middlewares/auth-middleware')

const router = Router()

//register
router.post('/register', registerValidation, validationMiddleware, register)

//login
router.post('/login', loginValidation, validationMiddleware, login)

//logout
router.post('/logout', userAuth, logout)

module.exports = router
