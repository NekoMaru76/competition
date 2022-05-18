import BasePlayer from "./BasePlayer";
import BaseRound from "./BaseRound";

export default class FastestRound extends BaseRound {
    type: "Fastest" = "Fastest";

    sort(a: BasePlayer, b: BasePlayer): number {
        return b.data.code.time - a.data.code.time;
    }
};