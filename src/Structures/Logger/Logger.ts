import { 
    format, 
    transports, 
    LoggerOptions, 
    Logger, 
    createLogger
} from "winston";
import { TransformableInfo } from "logform";
import { Colors } from "../Color/Color";

const { 
    combine, 
    label, 
    timestamp, 
    colorize, 
    printf 
} = format;
const log = printf(({ level, message, label, timestamp }: TransformableInfo): string => {
    const msg = `${timestamp} [${label}] ${level}: ${message}`;

    console.log(msg);
    return msg;
});

export function createFormat(colors: Colors, labelName: string): ReturnType<typeof combine> {
    return combine(
        label({ label: labelName }),
        timestamp(),
        colorize({
            colors: {
                error: colors.Error,
                warn: colors.Warn,
                info: colors.Info/*,
                http: 3,
                verbose: 4,
                debug: 5,
                silly: 6*/
            }
        }),
        log
    )
};

export function create(opts?: LoggerOptions): Logger {
    return createLogger(Object.assign({
        format: format.json(),
        defaultMeta: {},
        transports: [
            //
            // - Write all logs with importance level of `error` or less to `error.log`
            // - Write all logs with importance level of `info` or less to `combined.log`
            //
            new transports.File({ filename: `${__dirname}/../../logs/error.log`, level: 'error' }),
            new transports.File({ filename: `${__dirname}/../../logs/combined.log` })
        ]
    }, opts));
};