export default abstract class Random {
    static pick<V>(arr: V[]): V {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    static pickKey<Obj>(obj: Obj): keyof Obj {
        return Random.pick<keyof Obj>(Object.keys(obj) as (keyof Obj)[]);
    }
    static between(n1: number, n2?: number): number {
        const max = n2 || n1;
        const min = typeof n2 === "number" ? n1 : 0;

        return Math.floor(Math.random()*(max-min))+min;
    }
};