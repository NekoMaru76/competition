import { Message } from "discord.js";
import Bot from "./Structures/Bot/Bot";
import { format } from "winston";
import { create } from "./Structures/Logger/Logger";
import type { ColorList } from "./Structures/Color/Color";

const {
    combine,
    prettyPrint,
    timestamp,
    label
} = format;
const logger = create({
    format: combine(
        label({ label: "Main" }),
        timestamp(),
        prettyPrint()
    )
});

export default async function run(prefix: string, colorList: ColorList): Promise<Bot> {
    const bot = new Bot(prefix, colorList);

    await bot.commandsManager.scan(`${__dirname}/commands`);
    logger.info("Logging in...");
    await bot.login(process.env.TOKEN);
    logger.info(`Logged in as ${bot.user.tag}!`);

    bot.on("messageCreate", async (msg: Message) => {
        await bot.commandsManager.run(msg, bot);
    });

    return bot;
};