import BasePlayer from "./BasePlayer";
import BaseRound from "./BaseRound";

export default class ShortestRound extends BaseRound {
    type: "Shortest" = "Shortest";

    sort(a: BasePlayer, b: BasePlayer): number {
        return b.data.code.str.length-a.data.code.str.length;
    }
};