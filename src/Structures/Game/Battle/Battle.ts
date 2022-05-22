import { MessageEmbed, MessageOptions } from "discord.js";
import Bot from "../../Bot/Bot";
import BaseRound from "./BaseRound";
import BattleData from "./BattleData";
import FastestRound from "./FastestRound";
import RoundResult from "./RoundResult";
import Problems from "./Problems";
import Random from "../../Random/Random";
import BattleResult from "./BattleResult";
import Team from "./BattleTeam";
import { createBase, splitStrToFields } from "../../Embed/Embed";
import BasePlayer from "./BasePlayer";
import ShortestRound from "./ShortestRound";
import ms from "pretty-ms";

const Rounds = [FastestRound, ShortestRound];

export default class Battle {
    declare round: BaseRound;
    end: BattleResult["end"];
    bot: Bot;
    data: BattleData;
    id: string;

    static maxTeams = 3;
    constructor(opts: {
        bot: Bot,
        data: BattleData,
        id: string;
    }) {
        Object.assign(this, opts);
        this.createRound();
    }
    addTeams(teams: Team[]): void {
        for (const team of teams) {
            if (Object.keys(this.data.teams).length >= Battle.maxTeams) throw `A battle can only consists ${Battle.maxTeams} teams or less`;

            this.data.teams[team.id] = team;
        }
    }
    rmTeams(teams: Team[]): void {
        for (const team of teams) delete this.data.teams[team.id];
    }
    addPlayers(players: BasePlayer[]): void {
        for (const player of players) {
            this.bot.playersBattles.set(player.id, this);
            player.data.team.addPlayers([player]);

            player.data.team.data.players[player.id] = player;
            this.data.players[player.id] = player;
        }
    }
    rmPlayers(players: BasePlayer[]): void {
        for (const player of players) {
            this.bot.playersBattles.delete(player.id);
            player.data.team.rmPlayers([player]);

            delete player.data.team.data.players[player.id];
            delete this.data.players[player.id];
        }
    }
    async startRound(): Promise<void> {
        await this.round.start();
    }
    roundToEmbed(): MessageEmbed {
        const { round, bot } = this;

        if (!round.started) throw `Battle isn't started yet`;

        const {
            description,
            time: {
                max
            }
        } = Problems[round.data.problem];

        return createBase(bot.embedColors.Base)
            .setDescription(`**Description**: ${description}\n**Timer**: ${ms(max, { colonNotation: true })}\n**Ends In**: ${ms(max-(Date.now()-round.started.at), { colonNotation: true })}`)
            .setTitle(`${round.type} Round`);
    }
    createRound(): void {
        const { teams, players } = this.data;

        this.round = new (Random.pick(Rounds))(
            this,
            {
                teams,
                problem: Random.pickKey(Problems) as string,
                players
            }
        );
    }
    async run(log: string[] = []): Promise<RoundResult> {
        const { data, bot, round } = this;
        const { teams } = data;
        const scores = await round.run();
        const teamsScore: {
            [key: string]: number;
        } = {};

        for (const [id, team] of Object.entries(scores)) {
            teamsScore[id] = 0;

            for (const playerScore of Object.values(team)) {
                teamsScore[id] += playerScore;
            }
        }

        const sorted = Object.entries(teamsScore)
            .sort(([_1, a], [_2, b]) => b-a);

        let weakest: {
            score: number;
            teams: ({
                i: number;
                id: string;
            })[];
        };

        for (let i = 0; i < sorted.length; i++) {
            const score = sorted[i][1];
            const data = {
                i,
                id: sorted[i][0]
            };

            if (!weakest || weakest.score > score) weakest = {
                score,
                teams: [data]
            };
            else if (weakest.score === score) weakest.teams.push(data);
        }

        for (const { id } of weakest.teams) {
            let totalHP = 0;

            for (const {
                data: {
                    hp,
                    name
                }
            } of Object.values(teams[id].data.players)) {
                const to = Math.max(hp.current-1, 0);

                totalHP += hp.current = to;
                
                log.push(`Player ${name}'s HP has been reduced to ${to}/${hp.max}`);

                if (!hp.current) log.push(`Player ${name} has been eliminated`);
            }
    
            if (!totalHP) {
                teams[id].isLose = true;

                log.push(`Team ${teams[id].data.name} (${id}) has been eleminated`);
            }
        }

        let winner: string;
        const losers: string[] = [];
        const vTeams = Object.values(teams);

        for (const team of vTeams) {
            if (team.isLose) losers.push(team.id);
            else winner = team.id;
        } 

        const User = bot.db.get("User");
        const runIfEnd = async () => {
            for (const [id1, { 
                data: { players } 
            }] of Object.entries(data.teams)) {
                for (const [id2, player] of Object.entries(players)) {
                    if (player.type === "Human") {
                        const upd: any = {
                            $inc: {}
                        };
    
                        if (id1 === winner) upd.$inc.win = 1;
                        else if (!winner) upd.$inc.draw = 1;
                        else upd.$inc.lose = 1;
    
                        await User.findOneAndUpdate({
                            id: id2
                        }, upd);
                    }

                    await player.end(bot, teams[winner]);
                    bot.playersBattles.delete(id2);
                }

                bot.battles.delete(id1);
            }
        };

        if (losers.length === vTeams.length) {
            await runIfEnd();

            this.end = {
                losers
            };
        } else if (losers.length === vTeams.length-1) {
            await runIfEnd();

            this.end = {
                losers,
                winner
            };
        } else {
            this.createRound();

            if (!log.length) log.push(`Nothing happen!`);

            for (const { 
                data: { players } 
            } of Object.values(teams)) {
                for (const player of Object.values(players)) {
                    await player.send(bot, {
                        embeds: [
                            createBase(bot.embedColors.Base)
                                .setTitle(`Battle Log`)
                                .addFields(splitStrToFields(log.join("\n"), { name: (i) => `Page ${i+1}` }))
                        ]
                    });
                }
            }
            await this.startRound();
        }

        return {
            scores,
            round
        };
    }
    async sendAll(opts: MessageOptions): Promise<void> {
        for (const player of Object.values(this.data.players)) {
            await player.send(this.bot, opts);
        }
    }
    async send(id: string, opts: MessageOptions): Promise<void> {
        const player = this.data.players[id];
            
        if (!player) return;
            
        return await player.send(this.bot, opts);
    }
    toEmbed(): MessageEmbed {
        const { id, data, bot, round } = this;
        const { teams, players, ownerId } = data;

        return createBase(bot.embedColors.Base)
            .setAuthor({
                name: `Battle ${id}`
            })
            .setTitle(`Owner: ${players[ownerId].data.name}`)
            .setFooter({
                text: `The battle is ${round.started ? "" : "not "}started`
            })
            .setDescription(
                Object.values(teams)
                    .map((team: Team) => `**Team ${team.data.name} (${team.id})**: ${team.toStatus()}`)
                    .join("\n")
            )
            
    }
};

