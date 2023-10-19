import mongoose from "mongoose";

const Schema = mongoose.Schema;

const procurementItemTypes = ["Office Supplies", "Construction Materials", "Electronics", "Industrial Equipment", "Chemicals", "Food and Beverages", "Other"];

const supRequestSchema = new Schema({

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
        enum: procurementItemTypes
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
    requestedBy: {
        type: String,
        required: true,
    }
})


const SupRequest = mongoose.model("supplier requests", supRequestSchema);
export default SupRequest;