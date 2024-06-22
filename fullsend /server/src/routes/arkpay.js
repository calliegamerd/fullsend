const express = require("express");
const router = express.Router();
const { validateJWT } = require("../middleware/auth");
const config = require("../config");
const User = require("../models/User");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");
const CardTransaction = require("../models/CardTransaction");
const axios = require("axios");
const crypto = require("crypto");
const { getDepositState } = require("../controllers/site-settings");

function generateSignature(requestBody) {
  const httpMethod = 'POST';
  const apiUri = '/api/v1/merchant/api/transactions';
  const bodyString = JSON.stringify(requestBody);
  const apiKey = config.authentication.arkpay.api_secret; 
    
  const payload = `${httpMethod} ${apiUri}\n${bodyString}`;
  const hmac = crypto.createHmac('sha256', apiKey).update(payload).digest('hex');

  return hmac;
};

/**
 * @route   POST /api/arkpay/initialize
 * @desc    Initialize the payment request and return the redirect url
 * @access  Public
 */
router.post("/initialize", validateJWT, async (req, res, next) => {
  try {
    // Validate input
    const { site_value } = req.body;

    if (isNaN(parseFloat(site_value)) || parseFloat(site_value) <= 0) {
      return res.json({ success: false, message: "Invalid deposit amount." });
    }

    const siteValue = parseFloat(site_value);

    const isEnabled = getDepositState();

    if (!isEnabled) {
      return res.json({
        success: false,
        message: "Deposits are not enabled!"
      });
    }

    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found in the database!"
      });  
    }

    const newTransaction = new CardTransaction({
      type: "deposit",
      currency: "USD", 
      siteValue: siteValue,
      usdValue: (siteValue/2).toFixed(2), 
      txid: "",
      link: "",
      state: 0,
      _user: user._id
    });

    await newTransaction.save();

    const body = {
      "merchantTransactionId": String(newTransaction._id),
      "amount": parseFloat((siteValue/2).toFixed(2)),
      "currency": "USD",
      "description": "Description",
      "externalCustomerId": String(user._id),
      "handlePayment": false,
      "returnUrl": "https://fullsend.gg",
    };

    const headers = {
      'X-Api-Key': config.authentication.arkpay.api_key, 
      'signature': generateSignature(body),
      'Content-Type': 'application/json'
    };

    const response = await axios.post(`${config.authentication.arkpay.api_url}/merchant/api/transactions`, body, { headers });

    newTransaction.txid = response.data.transaction.id;
    newTransaction.link = response.data.redirectUrl;

    await newTransaction.save();

    return res.json({
      success: true,
      message: null,
      redirectUrl: response.data.redirectUrl
    }); 
  } catch (error) {
    console.error(error)
    return next(error);
  }
});

/**
 * @route   POST /api/arkpay/callback
 * @desc    Get the callback from arkpay and credit the user
 * @access  Public
 */
router.post("/callback", async (req, res, next) => {
  try {
    // Validate input
    const { 
      id, 
      merchantTransactionId, 
      externalCustomerId, 
      companyId,
      email,
      amount,
      fee,
      earning,
      status,
      mid,
      currencyCode,
      store,
      redirectUrl
    } = req.body;

    let user = await User.findOne({ _id: externalCustomerId });

    if(status == "NOT_STARTED") {
      res.statusCode = 200;
      return res.end('OK');
    }

    if(status == "CANCELED") {
      try {
        const { io } = require('../index.js');

        await CardTransaction.findOneAndUpdate(
          { _id: merchantTransactionId },
          {
            $set: {
              state: 5
            }
          }
        );

        res.statusCode = 200;
        return res.end('OK');
      } catch (error) {
        console.error(error);
      }
      res.statusCode = 200;
      return res.end('OK');
    }

    if(status == "REFUNDED") {
      insertNewWalletTransaction(externalCustomerId, siteValue, `Credit Card Deposit Refunded`);
      res.statusCode = 200;
      return res.end('OK');
    }

    if(status == "PROCESSING" || status == "FAILED" || status == "CANCELED") {
      try {
        const { io } = require('../index.js');
        io.of('/chat').to(user._id).emit("notification", `Current status of card deposit: ${status}.`);

        await CardTransaction.findOneAndUpdate(
          { _id: merchantTransactionId },
          {
            $set: {
              state: status == "PROCESSING" ? 1 : status == "CANCELED" ? 6 : 2,
            }
          }
        );

        res.statusCode = 200;
        return res.end('OK');
      } catch (error) {
        console.error(error);
      }
    }

    if(status == "SUCCESS") {
      // if the tax is on the user do earnings - fee instead of amount
      const siteValue = parseFloat((amount*2).toFixed(2));

      const tx = await CardTransaction.findOne({ _id: merchantTransactionId });
      if(tx.status == 2 || tx.status == 3 || tx.status == 6) {
        console.log("ARKPAY >> Card transaction state already: " + status);
        res.statusCode = 200;
        return res.end('OK');
      }

      await CardTransaction.findOneAndUpdate(
        { _id: merchantTransactionId },
        {
          $set: {
            siteValue: siteValue,
            usdValue: amount,
            state: 3,
            arkpayId: id,
            email: email,
            fee: fee,
            store: store
          }
        }
      );
  
      insertNewWalletTransaction(externalCustomerId, siteValue, `Credit Card Deposit`);
      user = await User.findOneAndUpdate(
        { _id: externalCustomerId },
        {
          $inc: {
            wallet: siteValue, 
            totalDeposited: siteValue,
            wagerNeededForWithdraw: user.wagerNeededForWithdraw < 0 ? Math.abs(user.wagerNeededForWithdraw) + parseFloat(siteValue) : parseFloat(siteValue)
          }
        }
      );
  
      try {
        const { io } = require('../index.js');
        io.of('/chat').to(user._id).emit("update-wallet", siteValue);
        io.of('/chat').to(user._id).emit("notification", `Your credit card deposit has processed for ${siteValue} coins ($${earning})!`);
      } catch (error) {
        console.error(error);
      }  

      try {
        const information = `
          \`\`\`
User: ${user.username}
UID: ${user._id}

Method: Arkpay
Value: $${amount}

TXID: ${id}
OBJID: ${merchantTransactionId}
\`\`\`
        `

        await axios.post(config.site.discordDepositWebhook ,{
          "username": "Deposit",
          "avatar_url": "https://i.imgur.com/4M34hi2.png",
          "content": "@everyone New Deposit!" + information,
        });
      } catch(error) {
        console.error(error)
      }
    }

    res.statusCode = 200;
    return res.end('OK');
  } catch (error) {
    res.statusCode = 400;
    res.end('Failed');
    console.error(error)
    return next(error);
  }
});

module.exports = router;