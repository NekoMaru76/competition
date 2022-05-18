import { Message } from "discord.js";
import Bot from "../Bot/Bot";
import { TruthyTest } from "../Types/Test";
import Arg from "./Argument";
import { Document } from "mongoose";
import Command from "./Command";

export interface CallbackFunctionOptions<T extends any = any> {
    msg: Message;
    testArgs: TruthyTest<T>[];
    rawArgs: string[];
    restArgs: string[];
    bot: Bot;
    user: Document;
}
export interface Callback<T = any> {
    func: (opts: CallbackFunctionOptions<T>) => Promise<any> | any;
    args: Arg[];
    only?: Command["only"];
}