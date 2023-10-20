import mongoose from "mongoose";
const procurementItemTypes = ["Office Supplies", "Construction Materials", "Electronics", "Industrial Equipment", "Chemicals", "Food and Beverages", "Other"];
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    itemTypes: {
        type: [String], // Assuming itemTypes is an array of strings
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    addresses: [
        {
            monileNo: String,
            houseNo: String,
            street: String,
            landmark: String,
            city: String,
            postalCode: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);
export default User;
