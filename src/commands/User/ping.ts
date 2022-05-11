import { CallbackFunctionOptions, Callback } from "../../Structures/Command/Callback";

const callbacks: Callback[] = [
    {
        async func({
            msg,
            bot
        }: CallbackFunctionOptions): Promise<void> {
            const now = Date.now();
            const m = await msg.channel.send("Pinging...");

            await m.edit(`**Latency**: ${(Date.now()-now).toLocaleString()}ms\n**WS**: ${bot.ws.ping.toLocaleString()}ms`);
        },
        args: []
    }
];

export {
    callbacks
};