import type Test from "./Test";

module Type {
    export type Type = any;
}

export default abstract class Type {
    constructor(public readonly name: string) {}
    test(val: string): Test<Type.Type> {
        return {
            is: true,
            expected: this.name,
            val,
            rawVal: val
        };
    }
    abstract toUsage(): string | void;
};