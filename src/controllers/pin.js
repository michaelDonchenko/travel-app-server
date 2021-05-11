const Pin = require('../models/Pin')
const PinComments = require('../models/PinComments')
const { Types } = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const PinRating = require('../models/PinRating')
const PinImages = require('../models/PinPictures')
const cloudinary = require('cloudinary')
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require('../constants')

//cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

exports.createPin = async (req, res) => {
  const { placeName, long, lat } = req.body
  const user = req.user

  try {
    if (!placeName) {
      return res.status(400).json({
        success: false,
        message: 'Place name is required',
      })
    }
    const pin = await Pin.create({
      placeName,
      long,
      lat,
      createdBy: user._id,
    })

    return res.status(201).json({ success: true, pin })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.getPins = async (req, res) => {
  try {
    const pins = await Pin.find()

    return res.status(201).json({ success: true, pins })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.getPin = async (req, res) => {
  const id = req.params.id
  try {
    const pin = await Pin.findById(id)
    if (!pin) {
      return res
        .status(404)
        .json({ success: false, message: 'Could not find the marker' })
    }

    return res.status(200).json({ success: true, pin })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.addComment = async (req, res) => {
  const postedBy = req.user.username
  const { pinId, body } = req.body
  const user = req.user
  let relatedTo = Types.ObjectId(pinId)

  try {
    let comment = {
      _id: uuidv4(),
      body,
      postedBy,
      createdAt: Date.now(),
      createdBy: user._id,
    }

    let exist = await PinComments.findOne({ relatedTo })

    if (exist) {
      exist.comments.unshift(comment)
      await exist.save()
      return res.status(200).json({ comments: exist, success: true })
    }

    //in case if it is the first comment create comments document
    let newComment = new PinComments({ relatedTo, comments: comment })

    await newComment.save()
    return res.status(201).json({ comments: newComment, success: true })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.getComments = async (req, res) => {
  const pinId = req.params.pinId

  try {
    const comments = await PinComments.findOne({ relatedTo: pinId })

    if (!comments) {
      return res.status(200).json({
        success: true,
        comments: [],
      })
    }

    return res.status(200).json({
      success: true,
      comments,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.deleteComment = async (req, res) => {
  const pinId = req.params.pinId
  const commentId = req.params.commentId

  try {
    let comments = await PinComments.findOne({ relatedTo: pinId })

    let filtered = comments.comments.filter(
      (comment) => comment._id !== commentId
    )

    comments.comments = filtered
    await comments.save()

    return res.status(200).json({
      success: true,
      comments,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.addRating = async (req, res) => {
  let user = req.user
  let { pinId, value } = req.body
  let relatedTo = Types.ObjectId(pinId)
  let rating = {
    value,
    createdBy: user._id,
  }

  try {
    let exist = await PinRating.findOne({ relatedTo })

    if (exist) {
      //check if user already rated
      let createdByArray = exist.ratings.map((rating) => rating.createdBy)

      let ratingIncludesIndex = createdByArray.indexOf(user._id)

      if (ratingIncludesIndex !== -1) {
        exist.ratings.splice(ratingIncludesIndex, 1)
        exist.ratings.push(rating)
        await exist.save()

        return res
          .status(200)
          .json({ success: true, message: 'Rating changed', rating: exist })
      }

      exist.ratings.push(rating)
      await exist.save()

      return res
        .status(200)
        .json({ success: true, message: 'Rating added', rating: exist })
    }

    let newRatingArray = await PinRating.create({
      relatedTo,
      ratings: rating,
    })

    return res
      .status(200)
      .json({ success: true, message: 'Rating added', rating: newRatingArray })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.getRating = async (req, res) => {
  const { pinId } = req.params
  try {
    const rating = await PinRating.findOne({ relatedTo: pinId })
    if (!rating) {
      return res.status(200).json({
        success: true,
        rating: [],
      })
    }

    return res.status(200).json({
      success: true,
      rating,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.deletePin = async (req, res) => {
  const id = req.params.id
  try {
    const pin = await Pin.findByIdAndDelete(id)
    if (!pin) {
      return res
        .status(404)
        .json({ success: false, message: 'Could not find the marker' })
    }

    const pinImages = await PinImages.findOne({ relatedTo: id })

    if (pinImages) {
      pinImages.images.forEach((img) => {
        cloudinary.uploader.destroy(img.public_id, async ({ result }) => {
          //if cloudinary deleted the image
          if (result !== 'ok') {
            return res
              .status(400)
              .json({ success: false, message: 'Could not delete the images' })
          }
        })
      })

      await pinImages.remove()
    }

    await PinComments.findOneAndDelete({ relatedTo: id })
    await PinRating.findOneAndDelete({ relatedTo: id })

    return res
      .status(200)
      .json({ message: 'Marker deleted succefully', success: true })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
