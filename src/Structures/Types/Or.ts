import Type from "./Type";
import Test from "./Test";
import Text from "./Text";
import Decimal from "./Decimal"; 

type Base = Type;

declare module Or {
    export type Type = any;
}

export default class Or extends Type {
    constructor(public readonly types: Or.Type[]) {
        super(Or.getName(types));
    }
    static getName(types: Type[]): string {
        return types.map((type: Type) => type.name).join(" | ");
    }
    test(val: string): Test<Or.Type[]> {
        const { types, name } = this;
        const o = {
            expected: name,
            rawVal: val
        };

        for (const type of types) {
            const test = type.test(val);

            if (test.is) return {
                is: true,
                val: test.val,
                expected: name,
                rawVal: val
            };
        }

        return {
            is: false,
            ...o
        };
    }
    toUsage() {
        return this.types.map((type: Type) => type.toUsage()).filter((type?: string) => type).join(" | ");
    }
};