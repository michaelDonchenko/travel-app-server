const { check } = require('express-validator')
const User = require('../models/User')

const username = check('username')
  .notEmpty()
  .withMessage('Username is required')
  .isLength({ min: 2, max: 15 })
  .withMessage('Username has to be between 2 and 15 characters')

const password = check('password')
  .isLength({ min: 6, max: 15 })
  .withMessage('Password has to be between 6 and 15 characters')

const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email')

//check if email exists
const emailExists = check('email').custom(async (value) => {
  const user = await User.findOne({ email: value })

  if (user) {
    throw new Error('Email already exists')
  }
})

//check if username exists
const usernameExists = check('username').custom(async (value) => {
  const user = await User.findOne({ username: value })

  if (user) {
    throw new Error('Username already taken')
  }
})

//check if username is currect (find user by the username)
const usernameCurrect = check('username').custom(async (value, { req }) => {
  const user = await User.findOne({ username: value })

  if (!user) {
    throw new Error('No user with such username')
  }

  //save user in req.user
  req.user = user
})

module.exports = {
  registerValidation: [username, email, password, emailExists, usernameExists],
  loginValidation: [username, password, usernameCurrect],
}
