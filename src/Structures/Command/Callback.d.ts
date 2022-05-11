import { Message } from "discord.js"
import Bot from "../Bot/Bot";
import Test from "../Types/Test"
import Arg from "./Argument"

export interface CallbackFunctionOptions<T extends any = any> {
    msg: Message;
    testArgs: Test<T>[];
    rawArgs: string[];
    restArgs: string[];
    bot: Bot;
}
export interface Callback<T = any> {
    func: (opts: CallbackFunctionOptions<T>) => Promise<any> | any;
    args: Arg[];
}