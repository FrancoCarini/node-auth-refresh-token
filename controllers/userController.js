const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const User = require("../models/User")
const AppError = require("../utils/appError")

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Check if email and password are not empty
  if (!email || !password) {
    return next(new ErrorResponse(`Email and password are required`, 400))
  }

  // Check user existance in db
  const foundUser = await User.find({ email }).select("+password")

  if (!foundUser) return next(new AppError("Incorrect email or passowrd", 401))

  // Evaluate if password match
  const isCorrectPassword = await foundUser.correctPassword(
    password,
    foundUser.password
  )
  if (!isCorrectPassword)
    return next(new AppError("Incorrect email or passowrd", 401))

  // Create Access Token
  const accessToken = jwt.sign(
    {
      email: foundUser.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "300s",
    }
  )

  // Create Refresh Token
  const refreshToken = jwt.sign(
    {
      email: foundUser.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  )

  // Save Refresh Token in DB
  foundUser.refreshToken = refreshToken
  await foundUser.save()

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  })
  res.json({ accessToken })
})

const refreshToken = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return next(new AppError("Unauthorized", 401))

  const refreshToken = cookies.jwt
  const foundUser = await User.findOne({ refreshToken })
  if (!foundUser) return next(new AppError("Not Allowed", 403))

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) {
      return next(new AppError("Not Allowed", 403))
    }

    const accessToken = jwt.sign(
      {
        email: decoded.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    )
    res.json({ accessToken })
  })
})

module.exports = {
  login,
  refreshToken,
}
