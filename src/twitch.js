const express = require("express");
const router = express.Router();
const request = require("request");
const TwitchJs = require('twitch-js').default;
const config = require("./config.js");


const { api, chat, chatConstants } = new TwitchJs({
    token: config.ACCESS_TOKEN,
    username: config.CHAT_USERNAME,
    clientId: config.CLIENT_ID,
});

var chatStatus = chat.connect().catch((error) => {
    console.error(error);
    process.exit(1);
});

module.exports = router;