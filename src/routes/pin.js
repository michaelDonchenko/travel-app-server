const { Router } = require('express')
const {
  createPin,
  getPins,
  getPin,
  addComment,
  getComments,
  deleteComment,
  addRating,
  getRating,
} = require('../controllers/pin')
const { userAuth } = require('../middlewares/auth-middleware')
const router = Router()

router.post('/create-pin', userAuth, createPin)
router.get('/get-pins', getPins)
router.get('/get-pin/:id', getPin)

router.post('/add-comment', userAuth, addComment)
router.get('/get-comments/:pinId', getComments)
router.delete('/delete-comment/:pinId/:commentId', userAuth, deleteComment)

router.post('/add-rating', userAuth, addRating)
router.get('/get-rating/:pinId', getRating)

module.exports = router
