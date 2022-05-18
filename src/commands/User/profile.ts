import { CallbackFunctionOptions, Callback } from "../../Structures/Command/Callback";
import { createBase } from "../../Structures/Embed/Embed";
import Titles from "../../Structures/Title/Titles";

const callbacks: Callback[] = [
    {
        async func({
            msg,
            bot,
            user
        }: CallbackFunctionOptions): Promise<void> {
            await msg.channel.send({
                embeds: [
                    createBase(bot.embedColors.Base)
                        .setAuthor({ name: `${msg.author.tag}'s Information` })
                        .setThumbnail(msg.author.avatarURL({ dynamic: true }))
                        .setDescription(`**Title**: ${Titles[user.get("titleId")]}\n**Registered At**: ${user.get("createdAt")}\n**W/D/L**: ${user.get("win")}/${user.get("draw")}/${user.get("lose")}`)
                ]
            });
        },
        args: []
    }
];
const projection = ["createdAt", "titleId", "win", "draw", "lose"];
const description = "Shows user's informations";

export {
    callbacks,
    projection,
    description
};