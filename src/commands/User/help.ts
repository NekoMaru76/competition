import { CallbackFunctionOptions, Callback } from "../../Structures/Command/Callback";
import Text from "../../Structures/Types/Text";
import Integer from "../../Structures/Types/Integer";
import { createBase, createError } from "../../Structures/Embed/Embed";
import Command from "../../Structures/Command/Command";
import Argument from "../../Structures/Command/Argument";
import { TruthyTest } from "../../Structures/Types/Test";

const callbacks: Callback[] = [
    {
        async func({
            msg,
            bot,
            testArgs
        }: CallbackFunctionOptions): Promise<void> {
            const cmdName = (testArgs[0] as TruthyTest<string>).val
            const cmd = bot.commandsManager.commands[cmdName];

            if (!cmd) {
                await msg.channel.send({
                    embeds: [
                        createError(bot)
                            .setDescription(`${cmdName} is not a valid command name`)
                    ]
                });

                return;
            }

            const {
                description,
                callbacks,
                category
            } = cmd;
            const embed = createBase(bot);

            embed.setDescription(`**Name**: ${cmdName}\n**Description**: ${description}\n**Category**: ${category}\n**Usage**:\n${callbacks.map((callback: Callback) => callback.args.map((arg: Argument) => `- \`${arg.type.toUsage()}\``).join(", ")).join("\n")}`);
            await msg.channel.send({
                embeds: [
                    embed
                ]
            });
        },
        args: [
            new Argument(new Text, "cmd name")
        ]
    },
    {
        async func({
            msg, 
            bot
        }: CallbackFunctionOptions): Promise<void> {
            const { commandsManager } = bot;
            const embed = createBase(bot);
            const list: {
                [key: string]: Command[];
            } = {};

            for (const cmd of Object.values(commandsManager.commands)) {
                if (!list[cmd.category]) list[cmd.category] = [cmd];
                else list[cmd.category].push(cmd);
            }

            for (const [category, cmds] of Object.entries(list)) {
                embed.addField(`Category ${category}`, cmds.map((cmd: Command) => `\`${cmd.name}\``).join(", "));
            }

            await msg.channel.send({
                embeds: [
                    embed
                ]
            });
        },
        args: []
    }
];

export {
    callbacks
};