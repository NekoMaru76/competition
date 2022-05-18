import { EmbedField, MessageEmbed, User } from "discord.js";
import { Color } from "../Color/Color";

export function createBase(color: Color): MessageEmbed {
    return new MessageEmbed()
        .setColor(color)
        .setTimestamp();
};

export function createError(color: Color): MessageEmbed {
    return new MessageEmbed()
        .setTitle(`Error`)
        .setTimestamp()
        .setColor(color);
};

export function splitStrToFields(str: string, { name, inline }: {
    name?: string | ((ind: number) => string);
    inline?: boolean | ((ind: number) => boolean);
} = {}): EmbedField[] {
    const limit = 1024;
    const fields: EmbedField[] = [];

    for (let i = 0; i < Math.ceil(str.length/limit); i++) {
        let nm: string;
        let il: boolean;

        if (typeof name === "string") nm = name;
        else if (!name) nm = "\0";
        else nm = name(i);

        if (typeof inline === "boolean") il = inline;
        else if (!inline) il = false;
        else il = inline(i);

        fields.push({
            name: nm,
            value: str.slice(i*limit, (i+1)*limit),
            inline: il
        });
    }

    return fields;
};