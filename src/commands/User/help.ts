import { CallbackFunctionOptions, Callback } from "../../Structures/Command/Callback";
import Text from "../../Structures/Types/Text";
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
            const { prefix, embedColors } = bot;

            if (!cmd) {
                await msg.channel.send({
                    embeds: [
                        createError(embedColors.Error)
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
            
            await msg.channel.send({
                embeds: [
                    createBase(embedColors.Base)
                        .setTitle(`Showing result for:  ${cmdName}`)
                        .setDescription(`**Name**: ${cmdName}\n\n**Description**: ${description}\n\n**Category**: ${category}\n\n**Usage**:\n${
                            callbacks.map(
                                (callback: Callback) => {
                                    let st = `- \`${prefix}${cmdName}\``;
                                    let en = ``;

                                    for (const { type, name } of callback.args) {
                                        const usage = type.toUsage();


                                        st += ` \`[${name}]\``;
                                        en += `\n\`${name}\`: \`${usage || `<${type.name}>`}\``;
                                        
                                    }

                                    return st + en + "\n";
                                }
                            )
                                .join("\n")
                        }`)
                ]
            });
        },
        args: [
            new Argument(new Text, `Command Name`)
        ]
    },
    {
        async func({
            msg, 
            bot
        }: CallbackFunctionOptions): Promise<void> {
            const { commandsManager, embedColors } = bot;
            const embed = createBase(embedColors.Base);
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