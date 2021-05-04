const Pin = require('../models/Pin')

exports.createPin = async (req, res) => {
  const { placeName, long, lat } = req.body

  try {
    const pin = await Pin.create({
      placeName,
      long,
      lat,
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
