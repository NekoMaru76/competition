import { Callback } from "./Callback.d"

export default interface Command<T = any> {
    name: string;
    callbacks: Callback<T>[];
    category: string;
    description: string;
}