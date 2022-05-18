import BasePlayer from "./BasePlayer";
import Team from "./BattleTeam";

export interface Teams {
    [key: string]: Team;
}

export interface Players {
    [key: string]: BasePlayer;
}

export interface BattleCollection {
    teams: Teams;
    players: Players;
}