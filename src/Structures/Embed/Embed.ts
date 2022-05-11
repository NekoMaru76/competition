import { MessageEmbed } from "discord.js";
import type Bot from "../Bot/Bot";

export function createBase({ user, colorList }: Bot): MessageEmbed {
    return new MessageEmbed()
        .setColor(colorList.Base)
        .setThumbnail(user.avatarURL({ dynamic: true }));
};

export function createError({ user, colorList }: Bot): MessageEmbed {
    return new MessageEmbed()
        .setTitle(`Error`)
        .setColor(colorList.Error)
        .setThumbnail(user.avatarURL({ dynamic: true }));
};