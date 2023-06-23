const Joi = require('joi');
const mongoose = require('mongoose');

// Define the schema
const schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        auto: true
    },
    meter_number: {
        type: String,
        required: true,
        maxLength: 6
    },
    token: {
        type: String,
        required: true,
        maxLength: 8
    },
    token_status: {
        type: String,
        enum: ['USED', 'NEW', 'EXPIRED'],
        required: true
    },
    token_value_days: {
        type: Number,
        required: true,
        maxLength: 11
    },
    purchased_date: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 11
    }
});


//validate token
exports.validateToken = (token) => {
    const schema = Joi.object({
        meter_number: Joi.string().required(),
        amount: Joi.number().max(182500).min(100),
    });
    return schema.validate(token);
}
// Create the model
module.exports.Token = mongoose.model('Token', schema);