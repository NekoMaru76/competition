import type Test from "./Test";

module Type {
    export type Type = any;
}

export default class Type {
    constructor(public readonly name: string, public def?: any) {}
    test(val: string): Test<Type.Type> {
        return {
            is: true,
            expected: this.name,
            val,
            rawVal: val
        };
    }
    toUsage(): string {
        const { def, name } = this;

        return `*<${name}${def ? `(Default: ${def})` : ""}>*`;
    }
};