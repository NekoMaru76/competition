import type Command from "./Command";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { create } from "../Logger/Logger";
import { format } from "winston";
import type { Message } from "discord.js";
import Test from "../Types/Test";
import Bot from "../Bot/Bot";
import { createError } from "../Embed/Embed";

const {
    combine,
    prettyPrint,
    timestamp,
    label
} = format;
const logger = create({
    format: combine(
        label({ label: "CommandsManager" }),
        timestamp(),
        prettyPrint()
    )
});

export class CommandsManager {
    constructor(public commands: Record<string, Command> = {}) {}
    clear(): void {
        this.commands = {};

        logger.info(`Deleted all commands`);
    }
    async scan(dir: string): Promise<typeof this["commands"]> {
        const { commands } = this;

        logger.info(`Scanning dir ${dir}`);

        for (const fOD of await readdir(dir)) {
            const path = join(dir, fOD);
            const info = await stat(path);

            if (info.isDirectory()) {
                logger.info(`Found dir ${path}`);
                await this.scan(path);
            } else {
                logger.info(`Found file ${path}`);

                const cmd: Command = require(path);

                cmd.name = cmd.name || fOD.split(".")[0];
                cmd.category = cmd.category || `None`;
                cmd.description = cmd.description || "None";
                
                logger.info(`Imported file ${path}\nName: ${cmd.name}\nCategory: ${cmd.category}\nCallbacks: ${cmd.callbacks.length}`);

                commands[cmd.name] = cmd;
            }
        }

        logger.info(`Finished scanning ${dir}`);
        
        return commands;
    }
    async run(msg: Message, bot: Bot): Promise<{
        cmd: Command,
        returned: any
    } | {
        cmd: Command,
        error: any
    } | undefined> {
        const { commands } = this;
        const { prefix } = bot;

        if (!msg.content.startsWith(prefix)) return;

        const args = msg.content.split(" ");
        const cmdName = args.splice(0, 1)[0].replace(prefix, '');
        const cmd = commands[cmdName];

        if (!cmd) return;

        for (const { func, args: cArgs } of cmd.callbacks) {
            let success = true;
            let i = 0

            const testArgs: Test<any>[] = [];

            for (; i < cArgs.length; i++) {
                const cArg = cArgs[i];

                if (args.length <= i) {
                    success = false;

                    break;
                }

                const uArg = args[i] || cArg.type.def;
                const test = cArg.type.test(uArg);

                if (!test.is) {
                    success = false;

                    break;
                }

                testArgs.push(test);
            }

            if (success) {
                try {
                    return {
                        returned: await func({
                            msg,
                            testArgs,
                            restArgs: args.slice(i),
                            rawArgs: args,
                            bot
                        }),
                        cmd
                    };
                } catch (error) {
                    logger.error(`Error from ${cmdName}`, { error });
                    console.error(error);
                    await msg.channel.send({
                        embeds: [
                            createError(bot)
                                .setDescription("Internal Error!")
                        ]
                    })

                    return {
                        cmd,
                        error
                    };
                }
            }
        }

        await msg.channel.send({
            embeds: [
                createError(bot)
                    .setDescription(`Please run \`${prefix}help ${cmdName}\`!`)
            ]
        })
    }
};