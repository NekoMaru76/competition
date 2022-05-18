import { CreateMessage, ErrorMessage, PingMessage, ReplyMessage } from "./Message";

export type Message =
    CreateMessage |
    ReplyMessage |
    ErrorMessage | 
    PingMessage