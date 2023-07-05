const router = require("express").Router();
const axios = require("axios");

const oldCryptoBalance = require("../models/oldCryptoBalanceSchema");


//calculate balance change daily, weekly and monthly basis
router.post('/:basedOn', async (req, res) => {
    try {
        let basedOn = req.params.basedOn;
        const cryptoAddress = req.query.address;
        const { year, month, day } = req.query;

        var respondData = {}

        if (basedOn === "daily") {

            const response = await axios.get(
                process.env.BSCSCAN_API_URL,
                {
                    params: {
                        module: "account",
                        action: "balance",
                        address: cryptoAddress,
                        apiKey: process.env.BSCSCAN_API_KEY
                    }
                }
            );
            const newBalance = await response.data.result;

            const date = await new Date();
            date.setHours(date.getHours() - 24);

            const findData = await oldCryptoBalance.find(
                {
                    cryptoAddress: cryptoAddress,
                    createdAt: { $lte: date }
                }
            ).sort({ createdAt: -1 }).limit(1);

            const lastDayBalance = await findData[0].cryptoBalance;
            const balanceChangeAmount = newBalance - lastDayBalance;
            const balanceChangePercentage = (balanceChangeAmount / lastDayBalance * 100); 

            respondData.cryptoAddress = cryptoAddress;
            respondData.todayBalance= newBalance;
            respondData.lastDayBalance= lastDayBalance;
            respondData.balanceChangeAmount= balanceChangeAmount;
            respondData.balanceChangePercentage = balanceChangePercentage;
 
        } else if (basedOn === "weekely") {
            const response = await axios.get(
                process.env.BSCSCAN_API_URL,
                {
                    params: {
                        module: "account",
                        action: "balance",
                        address: cryptoAddress,
                        apiKey: process.env.BSCSCAN_API_KEY
                    }
                }
            );
            const newBalance = await response.data.result;

            const date = await new Date();
            date.setDate(date.getDate() - 7);

            const findData = await oldCryptoBalance.find(
                {
                    cryptoAddress: cryptoAddress,
                    createdAt: { $lte: date }
                }
            ).sort({ createdAt: -1 }).limit(1);

            const lastDayBalance = await findData[0].cryptoBalance;
            const balanceChangeAmount = newBalance - lastDayBalance;
            const balanceChangePercentage = (balanceChangeAmount / lastDayBalance * 100);

            respondData.cryptoAddress = cryptoAddress;
            respondData.todayBalance = newBalance;
            respondData.lastDayBalance = lastDayBalance;
            respondData.balanceChangeAmount = balanceChangeAmount;
            respondData.balanceChangePercentage = balanceChangePercentage;

        } else if (basedOn === "monthly") {
            const response = await axios.get(
                process.env.BSCSCAN_API_URL,
                {
                    params: {
                        module: "account",
                        action: "balance",
                        address: cryptoAddress,
                        apiKey: process.env.BSCSCAN_API_KEY
                    }
                }
            );
            const newBalance = await response.data.result;

            const date = await new Date();
            date.setMonth(date.getMonth() - 1);

            const findData = await oldCryptoBalance.find(
                {
                    cryptoAddress: cryptoAddress,
                    createdAt: { $lte: date }
                }
            ).sort({ createdAt: -1 }).limit(1);

            const lastDayBalance = await findData[0].cryptoBalance;
            const balanceChangeAmount = newBalance - lastDayBalance;
            const balanceChangePercentage = (balanceChangeAmount / lastDayBalance * 100);

            respondData.cryptoAddress = cryptoAddress;
            respondData.todayBalance = newBalance;
            respondData.lastDayBalance = lastDayBalance;
            respondData.balanceChangeAmount = balanceChangeAmount;
            respondData.balanceChangePercentage = balanceChangePercentage;

        }

        res.status(200).json(respondData);

    } catch (err) {
        res.status(500).json("err: " + err);

    }
});

module.exports = router;