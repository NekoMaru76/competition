import RoundResult from "./RoundResult";

export default interface BattleResult {
    roundRes: RoundResult;
    end?: {
        winner?: string;
        losers: string[];
    }
}