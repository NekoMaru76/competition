import { Client, Intents, Message } from "discord.js";
import { CommandsManager } from "../Command/CommandsManager";
import { BotOptions } from "./Bot.d";
import { Logger } from "winston";
import Database from "../Database/Database";
import { Colors } from "../Color/Color";
import VMServer from "../VM/VMServer";
import Battle from "../Game/Battle/Battle";
import UID from "../../Structures/UID/UID";

export default class Bot extends Client {
    commandsManager: CommandsManager;
    logger?: Logger;
    prefix: string;
    db: Database;
    embedColors: Colors;
    vm: VMServer;
    battles: Map<string, Battle> = new Map;
    playersBattles: Map<string, Battle> = new Map;
    uid: UID;

    constructor(opts: BotOptions) {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGES
            ],
            partials: [
                "CHANNEL"
            ]
        });

        Object.assign(this, opts);
    }
    async login(token: string): Promise<string> {
        const { logger } = this;

        logger?.info("Logging in...");
        await super.login(token);

        const { user } = this;

        logger?.info(`Logged in as ${user.tag}!`);
    
        return user.id;
    }
};