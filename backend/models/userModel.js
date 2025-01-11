const mongoose = require("mongoose")

const Userschema = new mongoose.Schema({
    username: String,
    phone: Number,
    password: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' } // Add role
})

const UserModel = mongoose.model("User", Userschema)
module.exports = UserModel
