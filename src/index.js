const express = require('express')
const cors = require('cors')
const app = express()
const { PORT } = require('./constants')
const connectDB = require('./database')
const cookieParser = require('cookie-parser')
const { CLIENT_URL } = require('./constants')
const passport = require('passport')
//import passport middleware
require('./middlewares/passport-middleware')

//init middlewares
app.use(express.json({ limit: '5mb' }))
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(cookieParser())
app.use(passport.initialize())

//router imports
const userRoutes = require('./routes/users')
const pinRoutes = require('./routes/pin')

//use routes
app.use('/api', userRoutes)
app.use('/api', pinRoutes)

//app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })

    connectDB()
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()
