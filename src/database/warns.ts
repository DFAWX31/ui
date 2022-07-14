import { MessageEmbed } from "discord.js";
import { getClient } from ".";
import { Bot } from "../structures";

export async function getAllWarns(
    guildId: string
): Promise<MessageEmbed | null> {
    const bot = Bot.getInstance();

    const client = getClient();

    const allWarns = await client.members.findMany({
        where: {
            guildId: guildId,
        },
    });

    if (!allWarns || allWarns.length < 1) {
        return null;
    }

    const guild = await bot.guilds.fetch(guildId);

    const embed = new MessageEmbed()
        .setTitle(`All warns in the guild ${guild.name}`)
        .setDescription("The top bad boys😎 in the guild are:");

    allWarns.forEach((member) => {
        const user = guild.members.cache.get(member.userId);

        let username = "";

        if (!user) {
            username = member.userId;
        } else {
            username = user.displayName;
        }

        embed.addField(username, member.numberOfWarns.toString(), false);
    });

    return embed;
}

export async function getUserWarns(
    guildId: string,
    member: string
): Promise<MessageEmbed | null> {
    const bot = Bot.getInstance();

    const client = getClient();

    const warns = await client.warns.findMany({
        where: {
            member: member,
            guildId: guildId,
        },
    });

    if (!warns || warns.length < 1) {
        return null;
    }

    const guild = bot.guilds.fetch(guildId);

    const user = (await guild).members.cache.get(member);

    if (!guild || !user) return null;

    const embed = new MessageEmbed()
        .setTitle(`Warns given to user ${user.displayName}`)
        .setDescription(`${warns.length} warns found`)
        .setFooter({
            text: "All times are in UTC",
        });

    warns.forEach((warn) => {
        const time = `${
            warn.time.getUTCDate() < 10
                ? "0" + warn.time.getUTCDate().toString()
                : warn.time.getUTCDate()
        }-${
            warn.time.getUTCMonth() < 10
                ? "0" + warn.time.getUTCMonth().toString()
                : warn.time.getUTCMonth()
        }-${warn.time.getUTCFullYear()}\t${
            warn.time.getUTCHours() < 10
                ? "0" + warn.time.getUTCHours().toString()
                : warn.time.getUTCHours()
        }:${
            warn.time.getUTCMinutes() < 10
                ? "0" + warn.time.getUTCMinutes().toString()
                : warn.time.getUTCMinutes()
        }:${
            warn.time.getUTCSeconds() < 10
                ? "0" + warn.time.getUTCSeconds().toString()
                : warn.time.getUTCSeconds()
        }`;
        embed.addField(time, warn.reason, false);
    });

    return embed;
}
