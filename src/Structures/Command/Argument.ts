import Type from "../Types/Type";

export default class Argument {
    constructor(public type: Type, public name: string) {
        this.type = type;
        this.name = name;
    }
};