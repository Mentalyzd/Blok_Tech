const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Mongoose schema
let UserSchema = new Schema({
    email: String,
    pwd: String,
    firstname: String,
    lastname: String,
    age: Number,
    gymname: String,
    gymplace: String,
    gymerv: Number,
    profilePic: String,
    bio: String
})

module.exports = mongoose.model('User', UserSchema, 'users')