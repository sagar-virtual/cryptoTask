const router = require("express").Router();
const axios = require("axios");

const crypto = require("../models/cryptoSchema");
const cryptoBalance = require("../models/cryptoBalanceSchema");


//add new Crypto Address and balance in it
router.post("/", async (req, res) => {

    try {

        const cryptoAddress = await req.body.cryptoAddress;

        //saving cryptoAddress Data to the collection if not exist

        const findCryptoAddress = await crypto.find({
            cryptoAddress: cryptoAddress
        });

        if (findCryptoAddress.length === 0) {
            const newCryptoAddress = await new crypto(req.body);

            await newCryptoAddress.save();
        }

        //adding cryptoAddress with balance in separate colleciton
        const find = await crypto.find({
            cryptoAddress: cryptoAddress
        });

        if (find.length === 1) {
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

            const balance = response.data.result;

            const newCryptoBalance = await new cryptoBalance(
                {
                    cryptoAddress: cryptoAddress,
                    cryptoBalance: balance
                }
            );


            const saveCryptoBalance = await newCryptoBalance.save()

            res.status(200).json(saveCryptoBalance);
        }
    } catch (err) {

        res.status(500).json("err: " + err);
    }
});

module.exports = router;