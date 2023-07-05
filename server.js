const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cryptoRoute = require("./routes/crypto");
const periodicBalanceFetchRoute = require("./routes/periodicBalanceFetch");
const cryptoBalanceDataCalculationRoute = require("./routes/cryptoBalanceDataCalculation");


const app = express();
app.use(express.json());
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() =>
        console.log("Connected to database"))
    .catch((err) =>
        console.log("error while connecting to database ===> " + err));

app.use("/api/crypto", cryptoRoute);
app.use("/api/periodicBalanceFetch", periodicBalanceFetchRoute);
app.use("/api/cryptoBalanceDataCalculation", cryptoBalanceDataCalculationRoute);

app.listen(process.env.port || 5000, () => {

    console.log("Server is listening ...");

});