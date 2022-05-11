import { Client, Intents } from "discord.js";
import { CommandsManager } from "../Command/CommandsManager";
import { ColorResolvable } from "discord.js";

export default class Bot extends Client {
    commandsManager: CommandsManager;

    constructor(public prefix: string, public colorList: Record<string, ColorResolvable>) {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES
            ]
        });

        this.commandsManager = new CommandsManager();
    }
};