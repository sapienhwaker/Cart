const mongoose = require('mongoose');
const Product = require('./product')

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    date: {type: String, required: true},
    location: {type: String, required: true},
    progress: { type: Number, default: 1 },
    comments: { type: Array }
});

module.exports = mongoose.model('Order', orderSchema);
