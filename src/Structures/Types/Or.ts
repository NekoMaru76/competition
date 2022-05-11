import Type from "./Type";
import Test from "./Test";
import Text from "./Text";
import Decimal from "./Decimal"; 

type Base = Type;

declare module Or {
    export type Type<Types extends Base[]> = any[];
}

export default class Or extends Type {
    constructor(public readonly types: Type[]) {
        super(Or.getName(types));
    }
    static getName(types: Type[]): string {
        return types.map((type: Type) => type.name).join(" | ");
    }
    test(val: string): Test<Or.Type<typeof this["types"]>> {
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
    toUsage(): string {
        return this.types.map((type: Type) => type.toUsage()).join(" | ");
    }
};

new Or([new Text, new Decimal]).test("dick")