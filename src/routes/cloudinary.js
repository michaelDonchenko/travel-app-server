const { Router } = require('express')
const {
  uploadImages,
  getPinImages,
  deleteImage,
} = require('../controllers/cloudinary')
const { userAuth } = require('../middlewares/auth-middleware')
const router = Router()

router.post('/upload-images', userAuth, uploadImages)
router.post('/delete-image', userAuth)

router.get('/get-images/:pinId', getPinImages)
router.delete('/delete-image', userAuth, deleteImage)

module.exports = router
