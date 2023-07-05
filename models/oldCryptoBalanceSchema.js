const mongoose = require("mongoose");


const oldCryptoBalanceSchema = mongoose.Schema(
    {
        cryptoAddress: {
            type: String,
        },
        cryptoBalance: {
            type: Number,
        },
        balanceChangeAmount: {
            type: Number
        },
        balanceChangePercentage: {
            type: Number
        }
    }, {
        timestamps: {
            createdAt: true,
            updatedAt: false
        }
    }
);

module.exports = mongoose.model("oldcryptoBalance", oldCryptoBalanceSchema);