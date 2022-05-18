import { ErrorMessage, ReplyMessage, CreateMessage, PingMessage } from "./Message";
import type { Message } from "./Message.d";
import Events from "node:events";

interface Thread extends Events {
    postMessage(m: any): void;
}

export default class Connection extends Events {
    createdMsgs: Map<string, CreateMessage> = new Map;

    constructor(public thread: Thread) {
        super();
        thread.on("message", (msg: Message) => {
            const { createdMsgs } = this;
            const { id } = msg;

            switch (msg.type) {
                case "Create": {
                    this.emit(`create-msg`, msg);
                    this.emit(`create-msg.${msg.ev}`, msg); 
                    
                    break;
                }
                case "Reply": {
                    this.emit(`reply-msg`, msg);
                    this.emit(`reply-msg.${id}`, msg);

                    if (createdMsgs.has(id)) {
                        (createdMsgs.get(id) as CreateMessage).emit("reply-msg", msg);
                        createdMsgs.delete(id);
                    }
                    
                    break;
                }
                case "Error": {
                    this.emit(`error-msg`, msg);
                    this.emit(`error-msg.${id}`, msg);

                    if (createdMsgs.has(id)) {
                        (createdMsgs.get(id) as CreateMessage).emit("error-msg", msg);
                        createdMsgs.delete(id);
                    }
                    
                    break;
                }
                case "Ping": this.emit(`ping`, msg); break;
            }
        });
    }
    send(msg: Message): Message {
        const { thread, createdMsgs } = this;

        if (msg.type === "Create") createdMsgs.set(msg.id, msg);

        thread.postMessage(msg.strip());

        return msg;
    }
    create(ev: string, data: any): CreateMessage {
        const msg = new CreateMessage(ev, data);

        this.createdMsgs.set(msg.id, msg);
        return this.send(msg) as CreateMessage;
    }
    reply(id: string, data: any): ReplyMessage {
        return this.send(new ReplyMessage(id, data)) as ReplyMessage;
    }
    error(id: string, data: any): ErrorMessage {
        return this.send(new ErrorMessage(id, data)) as ErrorMessage;
    }
    ping(time?: number): PingMessage {
        return this.send(new PingMessage(time)) as PingMessage;
    }
};