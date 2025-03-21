import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    frist_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: String,
    age: Number,
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart"
    },
})

export const userModel = mongoose.model(userCollection, userSchema);