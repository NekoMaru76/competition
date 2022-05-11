import Test from "./Test";
import Type from "./Type";

module Callback {
    export type Type<V> = V;
}

export default class Callback extends Type {
    constructor(name: string, public func: (...args: any[]) => any | Function) {
        super(name);
    }
    test(val: string): Test<Callback.Type<ReturnType<typeof this["func"]>>> {
        const { name, func } = this;
        const { is, val: v } = func(val);
        const o = {
            rawVal: val,
            expected: name
        };

        if (!is) return {
            is: false,
            ...o
        };

        return {
            is: true,
            ...o,
            val: v
        };
    }
};