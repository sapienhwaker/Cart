const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: {type: String, required: true}
    //productImage: { type: String, required: false }
});

module.exports = mongoose.model('Product', productSchema);

/*

-- Category of the task
-- Description of the task
-- Date to start
-- Location
-- Order details (Specifications)
---- Quantity
---- Price
-Progress (Stage)

 */