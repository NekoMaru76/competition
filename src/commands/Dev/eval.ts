const codeInBlock = /^```(?:js)?\s(.+[^\\])```$/is;

import Text from "../../Structures/Types/Text";
import Argument from "../../Structures/Command/Argument";
import { CallbackFunctionOptions, Callback } from "../../Structures/Command/Callback";
import { inspect } from "util";
import { createBase, createError, splitStrToFields } from "../../Structures/Embed/Embed";

const clean = (data: any): string => 
    inspect(data)
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
const callbacks: Callback[] = [
    {
        async func({
            msg,
            bot,
            testArgs,
            restArgs,
            user
        }: CallbackFunctionOptions): Promise<void> {
            if (msg.author.id !== "764835982892859452") throw "You can't use this :P";

            const {
                embedColors
            } = bot;
            let code = [testArgs[0].val, ...restArgs].join(" ");

            if (code.startsWith("```") && code.endsWith("```")) {
                code = code.replace("```", '').slice(0, -3);
            
                if (code.startsWith("js")) code = code.replace("js", "");
            }

            try {
                const evaled = await eval(code);

                await msg.channel.send({
                    embeds: [
                        createBase(embedColors.Base)
                            .addFields(...splitStrToFields((await clean(evaled)).replaceAll(bot.token, "[REDACTED]")))
                    ]
                });
            } catch (e) {
                await msg.channel.send({
                    embeds: [
                        createError(embedColors.Error)
                    ]
                });
            }
        },
        args: [
            new Argument(new Text, "code")
        ]
    }
];
const description = "";

export {
    callbacks,
    description
};