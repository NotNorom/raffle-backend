# Rafflebot for twitch - backend repo

## Setup
1. Clone.
    SSH: `git clone git@github.com:NotNorom/raffle-backend.git`
    HTTPS: `git clone https://github.com/NotNorom/raffle-backend.git`
2. Install dependecies
`npm install`
3. Set enviromental variables, like the ACCESS_TOKEN.
`ACCESS_TOKEN=abcdefghijklmnopqrstuvwxy`
4. Run server
`npm start`


### twitch chat commands:
* !raffle
    Adds user to the raffle   

* !unraffle
    Removes user from the raffle


### twitch chat events:
* RESUBSCRIPTION
    When a user renews their subscription
* SUBSCRIPTION
    When a user subscribes for the first time
* SUBSCRIPTION_GIFT
    When a user gets a gifted subscription
* SUBSCRIPTION_GIFT_COMMUNITY
    When a user gets a gifted subscription as a community gift

### twitch webhook events:
* FOLLOW
    When a channel is being followed by a user