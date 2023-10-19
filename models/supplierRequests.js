const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supRequest = new Schema({

    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        required: true,
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
})

const souvenir = mongoose.model("supplier requests", supRequest);

module.exports = souvenir;