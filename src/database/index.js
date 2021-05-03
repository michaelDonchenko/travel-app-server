const mongoose = require('mongoose')
const { MONGO_URL } = require('../constants')

const connectDB = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('MongoDB connected')
    })
    .catch((err) => {
      console.log(err.message)
    })
}

mongoose.set('useCreateIndex', true)

module.exports = connectDB
