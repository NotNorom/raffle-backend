const Pool = require('pg').Pool
const pool = new Pool({
    user: 'raffle',
    host: '/run/postgresql',
    database: 'raffle',
    password: 'raffle',
    port: 5432,
});
const logger = require("./logging.js");

module.exports = {
    pool,
};