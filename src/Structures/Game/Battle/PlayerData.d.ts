import Team from "./BattleTeam";

export default interface PlayerData {
    name: string;
    hp: {
        current: number;
        max: number;
    };
    code?: {
        time: number;
        str: string;
    };
    team: Team;
}