const express = require("express")
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")

const connectDB = require("./utils/db")
const errorHandler = require("./middlewares/errorsMiddleware")

const app = express()

// DB Connection
connectDB()

// JSON Parser
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

app.use("/api/users/", require("./routes/userRoutes"))

// Not Found Route
app.all("*", (req, res, next) => {
  res.status(500).json({ message: "Route does not exists" })
})

app.use(errorHandler)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`App running in port ${port}`)
})
