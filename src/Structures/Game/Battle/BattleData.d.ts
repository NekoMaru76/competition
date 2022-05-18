import { Players, Teams } from "./BattleCollection";

export default interface BattleData {
    teams: Teams;
    players: Players;
    ownerId: string;
}