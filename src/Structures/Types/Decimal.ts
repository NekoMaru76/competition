import Test from "./Test";
import Type from "./Type";

declare module Decimal {
    export type Type = number;
}

export default class Decimal extends Type {
    constructor() {
        super("Decimal");
    }
    test(val: string): Test<Decimal.Type> {
        const num = Number(val);
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
};