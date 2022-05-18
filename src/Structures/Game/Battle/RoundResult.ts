import BaseRound from "./BaseRound";

export default interface RoundResult {
    round: BaseRound;
    scores: {
        [key: string]: {
            [key: string]: number;
        };
    };
}