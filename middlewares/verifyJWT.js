const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const asyncHandler = require("express-async-handler")

const AppError = require("../utils/appError")

const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return next(new AppError("Missing Token", 401))

  const token = req.headers.authorization.split(" ")[1]

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_TOKEN_SECRET
  )

  req.user = decoded.email
  next()
})

module.exports = verifyJWT
