import Random from "../../Random/Random";
import Problem from "./Problem";

const alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H",
    "I", "J", "K", "L", "M", "N", "O", "P",
    "Q", "R", "S", "T", "U", "V", "W", "X",
    "Y", "Z", "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u", "v",
    "w", "x", "y", "z"
];
const Problems: Record<string, Problem> = {
    "A": {
        description: "Given 2 arguments, the first argument is an array of strings and the second one is a string from the array. Function will return the index of the string.",
        test(func: (arr: string[], str: string) => number): boolean {
            const len = 10;
            const arr: string[] = [];

            for (let i = 0; i < len; i++) {
                arr.push(Random.pick(alphabets));
            }

            const ind = Math.floor(Math.random() * arr.length-1);

            return func(arr, arr[ind]) === ind;
        },
        solve: "(arr, str) => arr.indexOf(str)",
        time: {
            ave: 1000*30,
            max: 1000*60*1.5
        }
    },
    "B": {
        description: "Given an argument, the first argument is length of a square. Function will return the area of the square.",
        test(func: (len: number) => number): boolean {
            const len = Random.between(1, 10);

            return func(len) === len**2;
        },
        solve: "(len) => len**2",
        time: {
            ave: 1000*30,
            max: 1000*60*1.5
        }
    },
    "C": {
        description: "Given an argument, the first argument is length of a square's area. Function will return the square's side length.",
        test(func: (len: number) => number): boolean {
            const area = Random.between(100, 1000);

            return func(area) === Math.sqrt(area);
        },
        solve: "(area) => Math.sqrt(area)",
        time: {
            ave: 1000*30,
            max: 1000*60*1.5
        }
    },
    "D": {
        description: "Given an argument, the first argument is an array. Function will return the removed duplicates version of the array without changing the values orders.",
        test(func: (arr: string[]) => string[]): boolean {
            const arr: string[] = [];
            const len = Random.between(10, 100);

            for (let i = 0; i < len; i++) {
                arr.push(Random.pick(alphabets));
            }

            const returned = func(arr);
            const removed = [...new Set(arr)];
            
            if (!Array.isArray(returned) || removed.length !== returned.length) return false;

            for (let i = 0; i < removed.length; i++) {
                const a = removed[i];
                const b = returned[i];

                if (a !== b) return false;
            }

            return true;
        },
        solve: "(arr) => [...new Set(arr)]",
        time: {
            ave: 1000*30,
            max: 1000*60*1.5
        }
    },
    "E": {
        description: "Given 2 arguments, the first argument is a list of numbers and the second argument is a number. Function will return true if there's any two sums (from the array) to the second argument, otherwise it will return false. Example: ([10, 5, 3, 7], 17) => true, because 10+7 is 17.",
        test(func: (arr: number[], target: number) => boolean): boolean {
            const arr: number[] = [];
            const t = Random.between(1, 100);
            const len = Random.between(3, 10);
            const prev = new Set;

            let res = false;

            for (let i = 0; i < len; i++) {
                const n = Random.between(1, 100);

                arr.push(n);

                if (!res) {
                    if (prev.has(t-n)) res = true;
                    else prev.add(n);
                }
            }

            return func(arr, t) === res;
        },
        solve: "(arr, target) => {\n\tconst previous = new Set;\n\tfor (const v of arr) {\n\t\tif (previous.has(target - v)) return true;\n\n\tprevious.add(v);\n\t}\n\treturn false;\n}",
        time: {
            ave: 1000*60,
            max: 1000*60*3 //have mercy
        }
    },
    "F": {
        description: "Function will return a random number between 1-10",
        test(func: () => number): boolean {
            const n = func();

            return 1 <= n && n <= 10;
        },
        solve: "() => Math.floor(Math.random() * 10) + 1",
        time: {
            ave: 1000*30,
            max: 1000*60*1.5
        }
    },
    "G": {
        description: "Function will return a random number between 1-10",
        test(func: () => number): boolean {
            const n = func();

            return 1 <= n && n <= 10;
        },
        solve: "() => Math.floor(Math.random() * 10) + 1",
        time: {
            ave: 1000*30,
            max: 1000*60*1.5
        }
    },
    "H": {
        description: "Given an argument, the argument is a number. Function will return how many '1' bits it has.",
        test(func: (n: number) => number): boolean {
            const n = Random.between(1, 100);

            return func(n) === n.toString(2).replaceAll("0", '').length;
        },
        solve: "(n) => n.toString(2).replaceAll('0', '').length",
        time: {
            ave: 1000*30,
            max: 1000*60*1.5
        }
    },
    "I": {
        description: "Given two arguments of binary strings. Function will return the sum of 2 arguments as a binary string.",
        test(func: (a: string, b: string) => string): boolean {
            const a = Random.between(1, 100);
            const b = Random.between(1, 100);

            return func(a.toString(2), b.toString(2)) === (a+b).toString(2);
        },
        solve: "(a, b) => (parseInt(a, 2)+parseInt(b, 2)).toString(2)",
        time: {
            ave: 1000*30,
            max: 1000*60*1.5
        }
    },
    "J": {
        description: "Given an argument, the first argument is a num rows of a Pascal's triangle. Function will return the first num rows of Pascal's triangle (`number[][]`).",
        test(func: (depth: number) => number[][]): boolean {
            const depth = Random.between(1, 5);
            const tri: number[][] = [];
            const res = func(depth);

            for (let i = 0; i < depth; i++) {
                const list: number[] = [1];
                const last = tri[i-1];
                const curr = res[i];

                if (curr[0] !== 1 || curr[curr.length-1] !== 1) return false;

                for (let l = 1; l < i; l++) {
                    const n = last[l-1]+last[l];

                    if (n !== curr[l]) return false;

                    list.push(n);
                }

                tri.push([...list, 1]);
            }

            return true;
        },
        solve: "(depth) => {\n\tconst tri = [];\n\n\tfor (let i = 0; i < depth; i++) {\n\t\tconst list = [1];\n\t\tconst last = tri[i-1];\n\n\t\tfor (let l = 1; l < i; l++) {\n\t\t\tlist.push(last[l-1]+last[l]);\n\t\t}\n\n\ttri.push([...list, 1]);\n\t}\n\n\treturn tri;\n}",
        time: {
            ave: 1000*30,
            max: 1000*60*1.5
        }
    }
};

export default Problems;