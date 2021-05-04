const { Router } = require('express')
const { createPin, getPins } = require('../controllers/pin')
const { userAuth } = require('../middlewares/auth-middleware')
const router = Router()

router.post('/create-pin', createPin)
router.get('/get-pins', getPins)

module.exports = router
