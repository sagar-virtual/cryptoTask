const mongoose = require("mongoose");


const cryptoSchema = mongoose.Schema(
    {
        cryptoAddress: {
            type: String,
            required: [true, "crypto address is required"],
            unique: true
        }
    }, { timestamps: true }
);

module.exports = mongoose.model("crypto", cryptoSchema);