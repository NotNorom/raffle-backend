const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "";
const CLIENT_ID = "u0lb5lhhljdcq7n7bm5ybtc7arxmj3";
const CHAT_USERNAME = "feedbackrafflebot";

// Defaults
const LUCK = 3;
const LUCK_SCALING = false;
const FOLLOWERS_ONLY = true;
const SUBSCRIBERS_ONLY = false;
const INACTIVITY_TIMEOUT_ENABLED = false;
const INACTIVITY_TIMEOUT_TIME = 30; // in minutes
const KEYWORD_ENTER = "!raffle";
const KEYWORD_LEAVE = "!unraffle";
const WINNER_MESSAGE = "$USERNAME has won the raffle!";
const WINNER_MESSAGE_SUB_PLAYS = "$USERNAME its time for your sub play!";

module.exports = {
    ACCESS_TOKEN,
    CLIENT_ID,
    CHAT_USERNAME,
    LUCK,
    LUCK_SCALING,
    FOLLOWERS_ONLY,
    SUBSCRIBERS_ONLY,
    INACTIVITY_TIMEOUT_ENABLED,
    INACTIVITY_TIMEOUT_TIME,
    KEYWORD_ENTER,
    KEYWORD_LEAVE,
    WINNER_MESSAGE,
    WINNER_MESSAGE_SUB_PLAYS,
}