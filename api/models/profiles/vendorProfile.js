const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    category: {type: String, required: true},
    firmName: {type: String, required: true},
    address: {type: String, required: true},
    country: {type: String, required: true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    zipCode: {type: String, required: true},
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    contactNumber: {type: String, required: true},
    rating: {type: String, default: "B"}
});

module.exports = mongoose.model('Vendor', vendorSchema);
