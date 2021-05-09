const { Schema, model, Types } = require('mongoose')

const PinImagesSchema = new Schema({
  images: {
    type: Array,
    url: String,
    public_id: String,

    createdAt: Date,
    postedBy: String,
    createdBy: Types.ObjectId,
  },

  relatedTo: {
    type: Types.ObjectId,
    ref: 'Pin',
  },
})

const PinImages = model('PinImages', PinImagesSchema)

module.exports = PinImages
