const router = require("express").Router();
const axios = require("axios");
const cron = require("node-cron");

const cryptoBalance = require("../models/cryptoBalanceSchema");
const oldCryptoBalance = require("../models/oldCryptoBalanceSchema");
const crypto = require("../models/cryptoSchema");


//fetch crypto data periodically
router.post("/", async (req, res) => {

    i = 1;
    let cronJob = null;

    try {

        if (cronJob = null) {
            cronJob.stop();
        }

        cronJob = cron.schedule("*/5 * * * * *", async () => {

            console.log("corn running:      " + i);

            const findCryptoAddress = await crypto.find();

            //finding the balance in the crypto wallet fetching the crypto address from the collection (*****timing problem*****)
            for (const crypto of findCryptoAddress) {

                const cryptoAddress = crypto.cryptoAddress;

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
                const balance = await response.data.result;

                await cryptoBalance.updateOne(
                    {
                        cryptoAddress: cryptoAddress
                    },
                    {
                        $set: { cryptoBalance: balance }
                    }
                );

                console.log("Balance updated .......");

                const findCryptoBalance = await cryptoBalance.find();

                //copying existing crypto balance data to new collection and removing those data from existing collection
                if (findCryptoBalance.length > 0) {
                    for (const cryptoTransfer of findCryptoBalance) {

                        const { _id, createdAt, updatedAt, __v, ...others } = cryptoTransfer._doc;
                        const balanceChangeAmount = balance - cryptoTransfer._doc.cryptoBalance;
                        const balanceChangePercentage = (balanceChangeAmount / cryptoTransfer._doc.cryptoBalance) * 100

                        const saveOldCryptoBalance = await new oldCryptoBalance({
                            ...others,
                            balanceChangeAmount,
                            balanceChangePercentage
                        });

                        saveOldCryptoBalance.save();

                        console.log("Balance moved ........")

                    };
                }

            };

            i++;

            res.status(200).json("Done");
        })


    } catch (err) {

        res.status(500).json("err: " + err);
    }
});

module.exports = router;