const { Schema, model, Types } = require('mongoose')

const PinRatingSchema = new Schema({
  ratings: {
    type: Array,
    value: Number,
    createdBy: Types.ObjectId,
  },

  relatedTo: {
    type: Types.ObjectId,
    ref: 'Pin',
  },
})

const PinRating = model('PinRating', PinRatingSchema)
module.exports = PinRating
