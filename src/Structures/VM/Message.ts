import Events from "node:events";
import UID from "../UID/UID";

const uid = new UID;

export abstract class BaseMessage extends Events {
    type: string;
    id: string;
    data: any;

    abstract strip(): any;
};

export class CreateMessage extends BaseMessage {
    ev: string;
    declare type: "Create";
    promise: Promise<ReplyMessage>;

    constructor(ev: string, data: any) {
        super();

        this.promise = new Promise(($, _) => {
            this.once("reply-msg", $)
                .once("error-msg", _);
        });
        this.ev = ev;
        this.data = data;
        this.type = "Create";
        this.id = uid.gen();
    }
    strip() {
        const { ev, data, id, type } = this;

        return {
            id,
            ev,
            data,
            type
        };
    }
};

export class ReplyMessage extends BaseMessage {
    declare type: "Reply";

    constructor(id: string, data: any) {
        super();

        this.data = data;
        this.type = "Reply";
        this.id = id;
    }
    strip() {
        const { data, id, type } = this;

        return {
            id,
            data,
            type
        };
    }
};

export class ErrorMessage extends BaseMessage {
    declare type: "Error";
    constructor(id: string, data: any) {
        super();

        this.data = data;
        this.type = "Error";
        this.id = id;
    }
    strip() {
        const { data, id, type } = this;

        return {
            id,
            data,
            type
        };
    }
};

export class PingMessage extends BaseMessage {
    declare type: "Ping";

    constructor(public data: number = Date.now()) {
        super();

        this.type = "Ping";
        this.id = uid.gen();
    }
    strip() {
        const { id, type, data } = this;

        return {
            id,
            type,
            data
        };
    }
};