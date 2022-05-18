export default interface Problem {
    description: string;
    test(func: Function): boolean;
    solve: string;
    time:{
        ave: number;
        max: number;
    }
}