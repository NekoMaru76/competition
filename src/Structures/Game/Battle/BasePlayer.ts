import { MessageOptions } from "discord.js";
import Bot from "../../Bot/Bot";
import BaseRound from "./BaseRound";
import Battle from "./Battle";
import PlayerData from "./PlayerData";
import ms from "ms";
import Team from "./BattleTeam";

export default abstract class BasePlayer {
    type: string;

    constructor(public id: string, public data: PlayerData) {}
    toString(): string {
        const { data, type, id } = this;
        const { hp, name, code } = data;
        const { current, max } = hp;

        return `**ID**: ${id}\n**Type**: ${type}\n**Name**: ${name}\n**HP**: ${current.toLocaleString()}/${max.toLocaleString()}\n**Code**: ${code ? ms(code.time) : "-"}`;
    }
    abstract send(bot: Bot, opts: MessageOptions): Promise<void> | void;
    abstract end(bot: Bot, winner?: Team): Promise<void> | void;
    abstract start(battle: Battle, round: BaseRound): Promise<void> | void;
};