import { parentPort } from "node:worker_threads";
import { VM } from "vm2";
import { CreateMessage } from "./Message";
import Connection from "./Connection";
import Problems from "../Game/Battle/Problems";

export default class VMServer extends Connection {
    constructor() {
        super(parentPort);
        this.on("create-msg.run", (msg: CreateMessage) => {
            let exported = false;

            try {
                const problem = Problems[msg.data.problem];
                const vm = new VM(Object.assign({
                    timeout: 10000,
                    sandbox: {
                        f: (f: Function): void => {
                            if (exported) return;
    
                            exported = true;
    
                            this.reply(msg.id, problem.test(f));
                        }
                    }
                }, msg.data.opts || {}));
                
                console.log(msg.data.code);
                vm.run(msg.data.code);

                if (!exported) this.error(msg.id, `Code doesn't exports a function`);
            } catch (e) {
                this.error(msg.id, e.message);
            }
        });
    }
};