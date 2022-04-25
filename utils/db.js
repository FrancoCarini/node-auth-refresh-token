const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE)
    console.log(`Mongo DB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.log(`Error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
