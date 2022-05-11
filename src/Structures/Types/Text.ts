import Test from "./Test";
import Type from "./Type";

export default class Text extends Type {
    constructor(public readonly only?: string) {
        super("Text");
    }
    test(val: string): Test<Text.Type> {
        const { only, name } = this;
        const o = {
            expected: name,
            rawVal: val
        };

        if (
            only && only === val ||
            val.length
        ) return {
            is: true,
            ...o,
            val
        }

        return {
            is: false,
            ...o
        };
    }
    toUsage(): string {
        const { only, name } = this;

        return only ? only : `*<${name}>*`;
    }
};

export declare module Text {
    export type Type = string;
}