const {ACCESS_TOKEN, CLIENT_ID, CLIENT_SECRET} = require("./config.js");
const passport = require("passport");
const twitchStrategy = require("passport-twitch").Strategy;

passport.use(new twitchStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "https://dev.nombox.de/auth/twitch/callback",
    scope: ["channel:read:subscriptions", "user_read"],
}, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    console.log("SERIALIZATION");
    console.log(user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("DESERIALIZATION");
    console.log(user);
    done(null, user);
});

function deleteUser(id) {
    return pool.query("DELETE FROM users WHERE id = $1", [id])
}

module.exports = passport;