export interface TruthyTest<V> {
    is: true;
    expected: string;
    rawVal: string;
    val: V;
}

export interface FalsyTest {
    is: false,
    expected: string;
    rawVal: string;
}

type Test<V> = TruthyTest<V> | FalsyTest

export default Test