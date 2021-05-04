const { Schema, model, Types } = require('mongoose')

const PinSchema = new Schema({
  placeName: String,
  long: Number,
  lat: Number,

  comments: [
    {
      comment: String,
      postedBy: {
        type: Types.ObjectId,
        ref: 'User',
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
})

const Pin = model('Pin', PinSchema)
module.exports = Pin
