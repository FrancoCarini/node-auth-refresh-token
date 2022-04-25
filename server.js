const express = require("express")
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")

const app = express()

// JSON Parser
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

app.use("/users/", require("./routes/userRoutes"))

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`App running in port ${port}`)
})
