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

var sessions = {};

var chatStatus = chat.connect();

router.use((req, res, next) => {
    if(!chatStatus) {
        console.log(chatStatus);
        res.send({ status: 500, message: "Not connected to twitch servers yet. Try again later."});
        return;
    }
    console.log(chatStatus);
    next();
});

router.get('/join/:channel', (req, res) => {
    var { channel } = req.params;
    var { access_token } = req.query;

    isAuthenticated(channel, access_token).then(() => {
        if (sessions[channel] !== undefined && sessions[channel]["connected"]) {
            console.warn(`Already connected to ${channel}`);
            res.send({ sessions: sessions });
            return;
        }
        // https://github.com/twitch-devs/twitch-js/blob/next/src/Chat/index.js#L254
        chat.join(channel).then((channelState) => {
            console.log(`joining ${channel}: ${channelState}`);
            
            // just to be sure
            chat.removeAllListeners(`PRIVMSG/#${channel}`);
            chat.removeAllListeners(`USERNOTICE/RESUBSCRIPTION/#${channel}`);
            chat.removeAllListeners(`USERNOTICE/SUBSCRIPTION/#${channel}`);
            chat.removeAllListeners(`USERNOTICE/SUBSCRIPTION_GIFT/#${channel}`);
            chat.removeAllListeners(`USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY/#${channel}`);

            // only handle messages targeted for this channel
            chat.on(`PRIVMSG/#${channel}`, (msg) => {
                console.log(`PRIVMSG/#${channel}`, msg);
            });
            chat.on(`USERNOTICE/RESUBSCRIPTION/#${channel}`, (msg) => {
                console.log(`USERNOTICE/RESUBSCRIPTION/#${channel}`, msg["tags"]["badges"]);
            });
            chat.on(`USERNOTICE/SUBSCRIPTION/#${channel}`, (msg) => {
                console.log(`USERNOTICE/SUBSCRIPTION/#${channel}`, msg);
            });
            chat.on(`USERNOTICE/SUBSCRIPTION_GIFT/#${channel}`, (msg) => {
                console.log(`USERNOTICE/SUBSCRIPTION_GIFT/#${channel}`, msg);
            });
            chat.on(`USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY/#${channel}`, (msg) => {
                console.log(`USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY/#${channel}`, msg);
            });
            // get some information about the logged in user
            api.get("users", {search: {
                login: channel.toLowerCase().trim(),
            }}).then((data) => {
                sessions[channel] = {
                    access_token: access_token,
                    connected: true,
                    channelData: data,
                };
                res.send({ sessions: sessions });
            });
        }).catch((error) => {
            console.error(error);
        });
    }).catch((error) => {
        console.error(error);
        res.status = error.status;
        res.send(error);
    });
});


router.get('/part/:channel', (req, res) => {
    var { channel } = req.params;
    var { access_token } = req.query;

    isAuthenticated(channel, access_token).then(() => {
        chat.removeAllListeners(`PRIVMSG/#${channel}`);
        chat.removeAllListeners(`USERNOTICE/RESUBSCRIPTION/#${channel}`);
        chat.removeAllListeners(`USERNOTICE/SUBSCRIPTION/#${channel}`);
        chat.removeAllListeners(`USERNOTICE/SUBSCRIPTION_GIFT/#${channel}`);
        chat.removeAllListeners(`USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY/#${channel}`);
        chat.part(channel); // part() does not return a promise
        sessions[channel] = {
            // spread first, then overwrite. otherwise the spread overwrites our variable
            ...sessions[channel],
            connected: false,
        };
        res.send({ sessions: sessions });
    }).catch((error) => {
        console.error(error);
        res.status = error.status;
        res.send(error);
    });
});

function isAuthenticated(login, access_token) {
    return new Promise((resolve, reject) => {
        // this resolve is only for devleopment!
        // it get's annoying to only be able to use yout own channel...
        // resolve("nice");
        var errorMessage = {status: 0, message: ""};
        if(access_token === undefined || access_token === "") {
            errorMessage = {status: 401, message: "not auhorized. no access_token provided"};
            reject(errorMessage);
        }
        request({
            url: "https://id.twitch.tv/oauth2/validate",
            headers: {
                Authorization: `OAuth ${access_token}`,
            },
        }, (error, response, body) => {
            if(error !== null) {
                console.error(error);
                errorMessage = {status: 500, message: "error talking to twitch"};
                reject(errorMessage);
            }
            if(response.statusCode !== 200) {
                console.warn(`Warning: ${response.statusCode}: ${response.statusMessage}`);
                if(response.statusCode === 401) {
                    errorMessage = {status: 401, message: "invalid access token"};
                    reject(errorMessage);
                }
                errorMessage = {status: 401, message: "authorization failed for unkown reasons"};
                reject(errorMessage);
            }

            // This should never happen, but if it does,
            // we should inform the user
            body = JSON.parse(body);
            if(body["client_id"] !== config.CLIENT_ID) {
                errorMessage = {status: 403, message: "requested and actual client_id differ"};
                reject(errorMessage);3
            }

            if(body["login"] !== login) {
                errorMessage = {status: 403, message: "requested and actual login differ"};
                reject(errorMessage);
            }
            resolve(body);
        });
    });
}

process.stdin.resume(); //so the program will not close instantly

process.on('exit', () => {
    console.log("EXIT");
    for(var channelName in Object.keys(sessions)) {
        chat.part(channelName);
    }
    chat.disconnect();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log("SIGINT");
    for(var channelName in Object.keys(sessions)) {
        chat.part(channelName);
    }
    chat.disconnect();
    process.exit(0);
});

module.exports = router;