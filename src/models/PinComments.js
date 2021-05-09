const { Schema, model, Types } = require('mongoose')

const PinCommentsSchema = new Schema({
  comments: {
    _id: String,
    type: Array,
    body: String,
    createdAt: Date,
    postedBy: String,
    createdBy: Types.ObjectId,
  },

  relatedTo: {
    type: Types.ObjectId,
    ref: 'Pin',
  },
})

const PinComments = model('PinComments', PinCommentsSchema)

module.exports = PinComments
