const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stocksSchema = new Schema({
    userId: String,
    name: String,
    symbol: String,
    region: String,
    currency: String,
    marketOpen: String,
    marketClose: String
})

const ModelClass = mongoose.model('stocks', stocksSchema)

module.exports = ModelClass; 