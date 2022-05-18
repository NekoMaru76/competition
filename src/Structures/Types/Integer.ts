import Test from "./Test";
import Type from "./Type";

declare module Integer {
    export type Type = number;
}

export default class Integer extends Type {
    constructor() {
        super("Integer");
    }
    test(val: string): Test<Integer.Type> {
        const num = parseInt(val);
        const o = {
            expected: this.name,
            rawVal: val
        };

        if (isNaN(num)) return {
            is: false,
            ...o
        };

        return {
            is: true,
            ...o,
            val: num
        };
    }
    toUsage() {}
};