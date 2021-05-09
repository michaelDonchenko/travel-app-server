const { Schema, model, Types } = require('mongoose')

const PinSchema = new Schema({
  placeName: String,
  long: Number,
  lat: Number,

  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
  },
})

const Pin = model('Pin', PinSchema)
module.exports = Pin
