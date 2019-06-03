module.exports = {
    CLIENT_SECRET: process.env.CLIENT_SECRET || "",
    CLIENT_ID: process.env.CLIENT_ID || "",
    ACCESS_TOKEN: process.env.ACCESS_TOKEN || "",
    CHAT_USERNAME: process.env.CHAT_USERNAME || "",
    
    // Defaults
    LUCK: 3,
    LUCK_SCALING: false,
    FOLLOWERS_ONLY: true,
    SUBSCRIBERS_ONLY: false,
    INACTIVITY_TIMEOUT_ENABLED: false,
    INACTIVITY_TIMEOUT_TIME: 30, // in minutes
    KEYWORD_ENTER: "!raffle",
    KEYWORD_LEAVE: "!unraffle",
    WINNER_MESSAGE: "$USERNAME has won the raffle!",
    WINNER_MESSAGE_SUB_PLAYS: "$USERNAME its time for your sub play!",
}