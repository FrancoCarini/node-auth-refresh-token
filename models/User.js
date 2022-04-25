const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    refreshToken: [String]
});

UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
  }

module.exports = mongoose.model('User', userSchema);