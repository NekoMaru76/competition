
import Random from "../../Random/Random";
import BasePlayer from "./BasePlayer";
import BaseRound from "./BaseRound";
import PlayerData from "./PlayerData";
import Problems from "./Problems";
import Uglify from "uglify-js";

export class ComputerPlayer extends BasePlayer {
    type = "Computer";
    timeout?: ReturnType<typeof setTimeout>;

    static minLevel = 1;
    static maxLevel = 3;

    constructor(id: string, public data: PlayerData & { level: number; }) {
        if (data.level < ComputerPlayer.minLevel || data.level > ComputerPlayer.maxLevel) throw `Level has to be between ${ComputerPlayer.minLevel}-${ComputerPlayer.maxLevel}`;

        super(id, data);
    }

    send() {}
    end() {}
    start(_, round: BaseRound): void {
        const {
            data: {
                level
            },
            timeout
        } = this;

        clearTimeout(timeout);

        const problem = Problems[round.data.problem];
        const time = Random.between(problem.time.ave, problem.time.max);
        let minifyOpts: Uglify.MinifyOptions;

        switch (level) {
            case 1: minifyOpts = {
                compress: false,
                output: {
                    beautify: true
                }
            }; break;
            case 2: minifyOpts = {
                compress: {},
                output: {
                    beautify: true
                }
            }; break;
            case 3: minifyOpts = {
                compress: {},
                output: {
                    beautify: false
                }
            }; break;
        }

        const { code } = Uglify.minify(`f(${problem.solve})`, minifyOpts);
        

        this.timeout = setTimeout(() => {
            if (round.battle.end) return;

            round.submit(this.id, code);
        }, time/level);
    }
    toString(): string {
        return super.toString() + `\n**Level**: ${this.data.level}`;
    }
};