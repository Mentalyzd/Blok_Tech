const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Mongoose schema
let FavoriteSchema = new Schema({
    fromBuddie: String,
    toBuddie: String
})

module.exports = mongoose.model('Favorite', FavoriteSchema, 'favorites')