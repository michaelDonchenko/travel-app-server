const cloudinary = require('cloudinary')
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require('../constants')
const PinImages = require('../models/PinPictures')

//cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

//upload image
exports.uploadImages = async (req, res) => {
  let { image, pinId } = req.body
  let user = req.user

  if (!image) {
    return res
      .status(400)
      .json({ message: 'Please choose an image to upload', success: false })
  }

  try {
    cloudinary.v2.uploader.upload(
      image,
      { folder: 'travel-app' },
      async (error, result) => {
        let { public_id, secure_url } = result
        let newImage = {
          public_id,
          url: secure_url,
          createdAt: Date.now(),
          postedBy: user.username,
          createdBy: user._id,
        }

        let pinImagesExist = await PinImages.findOne({ relatedTo: pinId })

        if (pinImagesExist) {
          pinImagesExist.images.push(newImage)

          await pinImagesExist.save()
          return res.status(200).json({
            success: true,
            message: 'Image was uploaded succefully',
            pinImages: pinImagesExist,
          })
        }

        let pinImages = await PinImages.create({
          images: newImage,
          relatedTo: pinId,
        })

        return res.status(201).json({
          success: true,
          message: 'Image was uploaded succefully',
          pinImages,
        })
      }
    )
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

//get pin images
exports.getPinImages = async (req, res) => {
  const { pinId } = req.params
  try {
    const pinImages = await PinImages.findOne({ relatedTo: pinId })

    if (!pinImages) {
      return res.status(200).json({
        success: true,
        pinImages: [],
      })
    }

    return res.status(200).json({
      success: true,
      pinImages,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

//delete image
exports.deleteImage = async (req, res) => {
  const { pinId, public_id } = req.body

  try {
    const pinImages = await PinImages.findOne({ relatedTo: pinId })

    if (!pinImages) {
      return res.status(400).json({
        success: false,
        message: 'Could not delete',
      })
    }

    cloudinary.uploader.destroy(public_id, async ({ result }) => {
      //if cloudinary deleted the image
      if (result === 'ok') {
        let filtered = await pinImages.images.filter(
          (image) => image.public_id !== public_id
        )

        pinImages.images = filtered
        await pinImages.save()

        return res
          .status(200)
          .json({ pinImages, success: true, message: 'Deleted succefully' })
      }

      return res
        .status(400)
        .json({ message: 'Could not delete the image', success: false })
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
