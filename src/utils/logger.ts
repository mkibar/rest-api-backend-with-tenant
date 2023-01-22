import { createLogger, transports, format, config } from "winston";
// import { MongoDB } from "winston-mongodb";
// import { dbUrl } from "./connectDB";

const { combine, timestamp, json } = format;

const userLogger = createLogger({
    levels: config.syslog.levels,
    defaultMeta: { component: 'user' },
    format: combine(
        //format.colorize(),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(({ timestamp, message, service }) => {
            return `[${timestamp}] ${service} : ${message}`;
        }),
        json()
    ),

    transports: [
        new transports.Console(),
        // new MongoDB({
        //     db: dbUrl,
        //     collection: 'logs',
        //     metaKey: 'meta'
        // })
    ]
});

export default userLogger;