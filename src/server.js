const express = require("express");
const session = require("express-session");
const sharedsession = require("express-socket.io-session");
const pgSession = require("connect-pg-simple")(session);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const {pool} = require("./database.js");
const sessionStore = new pgSession({pool: pool,});
const logger = require("./logging.js");
const passport = require("./auth.js");
//const twitchChat = require("./twitch.js");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const passportSocketIO = require("passport.socketio");
const port = process.env.PORT || 8000;

app.set("trust proxy", 1)
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const actualSession = session({
    key: "sid",
    store: sessionStore,
    secret: "CHANGE_ME",
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 30*24*60*60*1000} // 30 days
})
app.use(actualSession);
app.use(passport.initialize());
app.use(passport.session());


// AUTHENTICATION STUFF
app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", {
    successRedirect: "/",
    failRedirect: "/"
}), (err, req, res, next) => {
    if(err) {
        console.log(err);
        res.send(err);
    }
    res.redirect("/");
});
app.get("/auth/twitch/delete", (req, res) => {
    if(req.isAuthenticated()) {
        logger.info(`Delete user ${req.user.id} ${req.user.displayName}`);
        //passport.deleteUser(req.user.id);
        req.logout();
        req.session.destroy();
    }
    res.redirect("/");
});
app.get("/logout", (req, res) => {
    if(req.isAuthenticated()) {
        logger.info(`LOGOUT ${req.user.id} ${req.user.displayName}`);
        req.logout();
        req.session.destroy();
    }
    res.redirect("/");
});

app.get("/", (req, res) => {
    var isAuthenticated = req.isAuthenticated();
    if(isAuthenticated) {
        req.session.counter === undefined ? req.session.counter = 0 : req.session.counter += 1;
        res.send(req.session);
    } else {
        res.redirect("/auth/twitch");
    }
});

//app.use("/chat", twitchChat);

io.use(passportSocketIO.authorize({
    cookieParser: cookieParser,
    key: "sid",
    secret: "CHANGE_ME",
    store: sessionStore,
    success: (data, accept) => {logger.info("SOCKETIO ACCEPTED"); accept()},
    fail: (data, message, error, accept) => {if(error) {logger.warn("SOCKETIO FAIL"); accept(error)}},
}));

io.use(sharedsession(actualSession, {
    autoSave: true
}));

io.on("connection", socket => {
    if(socket.handshake.session.counter === undefined) socket.handshake.session.counter = 0;
    socket.emit("counter", socket.handshake.session.counter);
    socket.on("counter", (counter) => {
        socket.emit("counter", socket.handshake.session.counter += 1);
    });
});


server.listen(port, () => {
    logger.info("Server started on %d", port);
});