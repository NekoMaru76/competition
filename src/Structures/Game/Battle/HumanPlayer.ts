import { MessageEmbed, MessageOptions } from "discord.js";
import Bot from "../../Bot/Bot";
import BasePlayer from "./BasePlayer";
import Battle from "./Battle";
import Team from "./BattleTeam";

export default class HumanPlayer extends BasePlayer {
    type = "Human";

    async send(bot: Bot, opts: MessageOptions) {
        await (await bot.users.fetch(this.id)).send(opts);
    }
    async end(bot: Bot, winner?: Team): Promise<void> {
        await this.send(bot, {
            embeds: [
                new MessageEmbed()
                    .setTitle(`Battle has finished`)
                    .setColor(bot.embedColors.Base)
                    .setTimestamp()
                    .setDescription(winner ? `Team ${winner.data.name} (${winner.id}) won!` : "None won!")
            ]
        });
    }
    async start(battle: Battle): Promise<void> {
        await this.send(battle.bot, {
            embeds: [
                battle.roundToEmbed()
            ]
        });
    }
};