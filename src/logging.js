const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label } = format;

const logger = createLogger({
    level: "debug",
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.splat(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
    transports: [new transports.Console()],
});

module.exports = logger;