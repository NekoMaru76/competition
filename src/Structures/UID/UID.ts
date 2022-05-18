export default class UID {
    counter: number = 100;

    constructor() {}
    gen(): string {
        return (this.counter++).toString(16);
    }
}