import { Players, Teams } from "./BattleCollection";

export default interface RoundData {
    teams: Teams;
    problem: string;
    players: Players;
}