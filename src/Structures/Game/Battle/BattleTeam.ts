import { MessageEmbed, User } from "discord.js";
import { Color } from "../../Color/Color";
import { createBase } from "../../Embed/Embed";
import BasePlayer from "./BasePlayer";
import TeamData from "./TeamData";

export default class Team {
    isLose: boolean = false;

    static maxPlayers = 5;
    constructor(public id: string, public data: TeamData) {
        if (data.name.length > 10) throw `Team name can only consists 10 characters or less`;
    }
    addPlayers(players: BasePlayer[]): void {
        for (const player of players) {
            if (Object.keys(this.data.players).length >= Team.maxPlayers) throw `A team can only consists ${Team.maxPlayers} players or less`;
        
            this.data.players[player.id] = player;
        }
    }
    rmPlayers(players: BasePlayer[]): void {
        for (const player of players) {
            delete this.data.players[player.id];
        }
    }
    toStatus(): string {
        return this.isLose ? "Lost" : "Alive";
    }
    toEmbed(color: Color): MessageEmbed {
        const {
            data: {
                name, 
                players
            }
        } = this;
        const embed = createBase(color)
            .setAuthor({
                name: `Team ${name}`
            })
            .setDescription(`**Status**: ${this.toStatus()}`);

        for (const [id, player] of Object.entries(players)) embed.addField(`Player ${id}`, player.toString());
        
        return embed;
    }
};