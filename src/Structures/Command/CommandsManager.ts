import type Command from "./Command";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { CommandsManagerOptions } from "./CommandsManager.d";
import { Logger } from "winston";
import type { Message } from "discord.js";
import { TruthyTest, Test } from "../Types/Test";
import Bot from "../Bot/Bot";
import { createError } from "../Embed/Embed";

export class CommandsManager {
    logger?: Logger;
    commands: Record<string, Command>;

    constructor(opts: CommandsManagerOptions) {
        Object.assign(this, {
            commands: new Map
        }, opts);
    }
    clear(): void {
        this.commands = {};

        this.logger.info(`Removed all commands`);
    }
    async scan(dir: string): Promise<typeof this["commands"]> {
        const { commands, logger } = this;

        logger?.info(`Scanning dir ${dir}`);

        for (const fOD of await readdir(dir)) {
            const path = join(dir, fOD);
            const info = await stat(path);

            if (info.isDirectory()) {
                logger?.info(`Found dir ${path}`);
                await this.scan(path);
            } else {
                logger?.info(`Found file ${path}`);

                const cmd: Command = require(path);

                cmd.name = cmd.name || fOD.split(".")[0];
                cmd.category = cmd.category || `None`;
                cmd.description = cmd.description || "None";
                
                logger?.info(`Imported file ${path}\nName: ${cmd.name}\nCategory: ${cmd.category}\nCallbacks: ${cmd.callbacks.length}${cmd.only ? `\nOnly: ${cmd.only}` : ""}`);

                commands[cmd.name] = cmd;
            }
        }

        logger?.info(`Finished scanning dir ${dir}`);
        
        return commands;
    }
    async run(msg: Message, bot: Bot): Promise<void> {
        const { commands, logger } = this;
        const { prefix, db, embedColors } = bot;
        const checkOnly = (only?: Command["only"]) => {
            if (only === "guild" && msg.channel.type === "DM") throw `User cannot use this in dm`;
            if (only === "dm" && msg.channel.type !== "DM") throw `User can only use this in dm`;
        };

        try {
            if (msg.partial) msg = await msg.fetch();
        } catch {}

        if (!msg.content.startsWith(prefix)) return;

        const User = db.get("User");
        const args = msg.content.split(" ");
        const cmdName = args.splice(0, 1)[0].replace(prefix, '');
        const cmd = commands[cmdName];

        if (!cmd) return;

        try {
            checkOnly(cmd.only);
            
            //if (bot.locker.isLocked(msg.author.id, cmdName)) throw `You are unable to run this command`;

            for (const { func, args: cArgs, only } of cmd.callbacks) {
                let success = true;
                let i = 0

                const testArgs: Test<any>[] = [];

                for (; i < cArgs.length; i++) {
                    const cArg = cArgs[i];

                    if (args.length <= i) {
                        success = false;

                        break;
                    }

                    const uArg = args[i];
                    const test = cArg.type.test(uArg);

                    if (!test.is) {
                        success = false;

                        break;
                    }

                    testArgs.push(test);
                }

                if (success) {
                    checkOnly(only);

                    let user = await User.findOne({
                        id: msg.author.id
                    }, cmd.projection);

                    if (!user) {
                        await User.create({
                            id: msg.author.id
                        });
                        user = await User.findOne({
                            id: msg.author.id
                        }, cmd.projection);
                    }

                    await func({
                        msg,
                        testArgs: testArgs as TruthyTest<any>[],
                        restArgs: args.slice(i),
                        rawArgs: args,
                        bot,
                        user
                    });
                    
                    return;
                }
            }

            throw `Invalid usage! Please run \`${prefix}help ${cmdName}\`!`;
        } catch (error) {
            if (typeof error !== "string") {
                logger.error(`Error from ${cmdName}`, { error });
                console.error(error);
            }

            await msg.channel.send({
                embeds: [
                    createError(embedColors.Error)
                        .setDescription(typeof error === "string" ? error : error.message)
                ]
            });
        }
        
    }
};