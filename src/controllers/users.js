const User = require('../models/User')
const { sendMail } = require('./mail-sender')

exports.register = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const user = await User.create({ username, email, password })

    return res
      .status(201)
      .json({ success: true, message: 'User created succefully.', user })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.login = async (req, res) => {
  const { password } = req.body
  let user = req.user
  try {
    const currectPassword = await user.comparePassword(password)

    if (!currectPassword) {
      return res.status(400).json({ success: false, message: 'Wrong password' })
    }

    //remove password before sending the user back
    user.password = undefined

    const token = await user.generateJWT()

    return res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
      })
      .json({
        success: true,
        message: 'Logged in succefully',
        user,
      })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie('token', {
        httpOnly: true,
      })
      .json({
        success: true,
        message: 'Logged out succefully',
        user: null,
      })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
