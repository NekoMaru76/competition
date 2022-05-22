import { createError } from "../../Embed/Embed";
import BasePlayer from "./BasePlayer";
import Battle from "./Battle";
import Problems from "./Problems";
import RoundData from "./RoundData";
import RoundResult from "./RoundResult";

export default abstract class BaseRound {
    type: string;
    started?: {
        at: number;
    };
    timeout?: ReturnType<typeof setTimeout>;

    constructor(public battle: Battle, public data: RoundData) {}
    // Evaluate scores from players
    async run(): Promise<RoundResult["scores"]> {
        const { data, started, battle } = this;

        if (!started) throw `This round is not started yet`;

        const { teams, players, problem } = data;
        const scores: RoundResult["scores"] = {};
        const tmp: BasePlayer[] = [];

        for (const [id1, team] of Object.entries(teams)) {
            if (team.isLose) continue;

            scores[id1] = {};

            for (const [id2, {
                data: {
                    hp, code
                }
            }] of Object.entries(team.data.players)) {
                
                if (!(hp && code)) continue;

                try {
                    const testResult = (await this.battle.bot.vm.create("run", {
                        problem,
                        code: code.str
                    }).promise).data;

                    if (testResult) tmp.push(players[id2]);
                    else scores[id1][id2] = -1;
                } catch (e) {
                    await battle.send(id2, {
                        embeds: [
                            createError(battle.bot.embedColors.Error)
                                .setDescription(e.data)
                        ]
                    });

                    scores[id1][id2] = -1;
                }
            }
        }

        const sorted = tmp.sort(this.sort);

        for (let i = 0; i < sorted.length; i++) {
            const player = sorted[i];

            delete player.data.code;

            scores[player.data.team.id][player.id] = i+1;
        }

        return scores;
    }
    abstract sort(a: BasePlayer, b: BasePlayer): number;
    async submit(id: string, code: string): Promise<void> { //Submit while checking
        const hasSubmitted: string[] = [];
        const eligiblePlayers: string[] = [];
        const {
            data: {
                players
            },
            timeout
        } = this;

        const player = players[id];

        if (code.startsWith("```")) {
            if (code.startsWith("```js")) code = code.replace("```js", '');
            if (code.startsWith("```")) code = code.replace("```", '');
            if (code.endsWith("```")) code = code.slice(code.length-3);
        }

        if (!player) throw `Invalid ID`;
        if (!player.data.hp.current) throw `The player is already eliminated`;

        player.data.code = {
            str: code,
            time: Date.now()-this.started.at
        };

        for (const { data, id } of Object.values(this.data.players)) {
            if (data.code) hasSubmitted.push(id);
            if (data.hp.current) eligiblePlayers.push(id); 
        }

        if (hasSubmitted.length !== eligiblePlayers.length) return;
        
        clearTimeout(timeout);
        await this.battle.run();
    }
    async start(): Promise<void> {
        const { data, started } = this;

        if (started) throw `The round has started already`;

        const entries = Object.entries(data.teams);

        if (entries.length <= 1) throw `A battle must at least consists 2 teams`;

        for (const [id, {
            data: { players, name }
        }] of entries) {
            if (!Object.keys(players).length) throw `Team ${name} (${id}) is empty!`;
        }

        this.started = {
            at: Date.now()
        };

        for (const [_, { isLose, 
            data: { players } 
        }] of entries) {
            if (isLose) continue;

            for (const player of Object.values(players)) if (player.data.hp.current) await player.start(this.battle, this);
        }

        this.timeout = setTimeout(() => {
            this.battle.run([`Timeout!`]);
        }, Problems[data.problem].time.max);
        this.started.at = Date.now(); //the reason is because the round is actually started after setTimeout fired but `<Battle>#roundToProblem` need to be fired before this.
    }
};