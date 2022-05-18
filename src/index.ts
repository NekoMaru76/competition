require("dotenv").config({ path: `./vars/.env` });

import Bot from "./Structures/Bot/Bot";
import { create, createFormat } from "./Structures/Logger/Logger";
import { Logger } from "winston";
import { CommandsManager } from "./Structures/Command/CommandsManager";
import { 
    prefix, 
    colors as _colors
} from "../config.json";
import type { Colors } from "./Structures/Color/Color";
import Database from "./Structures/Database/Database";
import { Message } from "discord.js";
import { Worker } from "node:worker_threads";
import Connection from "./Structures/VM/Connection";
import { PingMessage } from "./Structures/VM/Message";
import UID from "./Structures/UID/UID";

const colors = _colors as {
    logger: Colors;
    embed: Colors;
};

const createLogger = (name: string): Logger => create({
    format: createFormat(colors.logger, name)
});

const botLogger = createLogger("Bot");
const commandsManagerLogger = createLogger("CommandsManager");
const dbLogger = createLogger("Database");
const vmLogger = createLogger("VMServer");

const worker = new Worker(`${__dirname}/Structures/VM/VMServerWorker.js`);
const vm = new Connection(worker);
const db = new Database(dbLogger);
const commandsManager = new CommandsManager({
    logger: commandsManagerLogger
});
const uid = new UID;
const bot = new Bot({
    logger: botLogger,
    commandsManager,
    db,
    prefix,
    embedColors: colors.embed,
    vm,
    uid
});

bot.on("messageCreate", async (msg: Message): Promise<void> => {
    await commandsManager.run(msg, bot);
});
vm.on("ping", (msg: PingMessage) => {
    vmLogger.info(`Ping ${(Date.now()-msg.data).toLocaleString()}ms`);
    vm.ping();
});
worker.on("online", async (): Promise<void> => {
    vmLogger.info(`Online`);
});
worker.on("exit", (exitCode: number): void => {
    vm.ping();
    vmLogger.info(`Exit ${exitCode}`);
});
worker.on("error", (err: Error): void => {
    vmLogger.error(`Error`, err);
});

(async () => {
    try {
        await commandsManager.scan(`${__dirname}/commands`);
        await db.scan(`${__dirname}/Schema`);
        await db.connect(process.env.MONGO_URI);
        await bot.login(process.env.TOKEN);
    } catch (e) {
        botLogger.error(`Error when initiating:`, e);
    }
})();