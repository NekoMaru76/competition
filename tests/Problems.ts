import Problems from "../src/Structures/Game/Battle/Problems";

for (const [id, problem] of Object.entries(Problems)) console.log(id, problem.test(eval(problem.solve)));