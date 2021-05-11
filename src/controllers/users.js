const User = require('../models/User')
const { sendMail } = require('./mail-sender')
const { CLIENT_URL } = require('../constants')

exports.register = async (req, res) => {
  const { username, email, password } = req.body
  try {
    await User.create({ username, email, password })

    return res
      .status(201)
      .json({ success: true, message: 'User created succefully.' })
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

exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email address' })
    }

    let user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'The user does not exist.',
      })
    }

    //run resetpassword function
    user.generatePasswordReset()
    await user.save()

    //send reset password email to the user
    let htmlPart = `
    <h1>Hello ${user.username},</h1>
    <h2>Do you want to reset your password?</h2>
    <p>Please click the following link in order to reset your password, if you did not request to reset your password just ingore this email.</p>
    <a href="${CLIENT_URL}/password-reset/${user.resetPasswordToken}">Reset Password</a>
    `

    let name = user.username
    let subject = 'Password reset request'
    let textPart = 'Password reset request'
    let customId = 'Password reset request'

    await sendMail(email, name, subject, textPart, htmlPart, customId)

    return res.status(200).json({
      success: true,
      message: `Password reset link was succefully sent to your email at ${user.email}, please check your mailbox for further instructions.`,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.passwordResetValidation = async (req, res) => {
  const { resetPasswordToken } = req.params
  try {
    let user = await User.findOne({ resetPasswordToken })
    const date = new Date()

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthoraized access, invalid verification code.',
      })
    }

    if (date > user.resetPasswordExpiresIn) {
      return res.status(401).json({
        success: false,
        message:
          'Your reset passwrod link has been expired, please get a new link in order to reset your password.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'The token is verified you may change your password now.',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.passwordResetAction = async (req, res) => {
  const { password, confirmPassword, resetPasswordToken } = req.body

  try {
    let user = await User.findOne({ resetPasswordToken })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthoraized access, invalid verification code.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password has to be at least 6 characters',
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      })
    }

    user.password = password
    user.resetPasswordToken = undefined

    await user.save()

    return res.status(200).json({
      success: true,
      message:
        'Your password is saved you can now log-in with your new password.',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}
