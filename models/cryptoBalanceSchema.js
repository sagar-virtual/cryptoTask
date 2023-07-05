const mongoose = require("mongoose");


const cryptoBalanceSchema = mongoose.Schema(
    {
        cryptoAddress: {
            type: String,
            required: true
        },
        cryptoBalance: {
            type: Number,
            required: true
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("cryptoBalance", cryptoBalanceSchema);