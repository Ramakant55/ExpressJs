const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // ✅ Unique hata diya
    dob: { type: Date, required: true },
    phone: { type: String, required: true, unique: true },
    avatar: { type: String },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    isEmailVerified: { type: Boolean, default: false },
    profilePicture: { type: String ,default:null}
});

module.exports = mongoose.model("User", UserSchema);
