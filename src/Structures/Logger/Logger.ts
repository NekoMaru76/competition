import { 
    format, 
    transports, 
    LoggerOptions, 
    Logger, 
    createLogger
} from "winston";

export function create(opts?: LoggerOptions): Logger {
    const logger = createLogger(Object.assign(opts, {
        level: 'info',
        format: format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
            //
            // - Write all logs with importance level of `error` or less to `error.log`
            // - Write all logs with importance level of `info` or less to `combined.log`
            //
            new transports.File({ filename: `${__dirname}/logs/error.log`, level: 'error' }),
            new transports.File({ filename: `${__dirname}/logs/combined.log` }),
        ]
    }));

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console({
            format: format.simple(),
        }));
    }

    return logger;
};