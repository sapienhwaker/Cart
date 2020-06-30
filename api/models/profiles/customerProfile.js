const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    address: {type: String, required: false},
    country: {type: String, required: false},
    state: {type: String, required: false},
    city: {type: String, required: false},
    zipCode: {type: String, required: false},
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    contactNumber: {type: String, required: true}
});

module.exports = mongoose.model('Customer', customerSchema);
