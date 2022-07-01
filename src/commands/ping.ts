import { SlashCommandBuilder } from "@discordjs/builders";
import { BaseCommandInteraction, CacheType, MessageEmbed } from "discord.js";
import { BotCommand } from "../structures";

class Ping extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Pings the bot.")
                .toJSON(),
            { timeout: 2000 }
        );
    }

    public async execute(
        interaction: BaseCommandInteraction<CacheType>
    ): Promise<void> {
        const embed = new MessageEmbed()
            .setTitle("Pong 🏓")
            .setDescription(`API Latency: \`${interaction.client.ws.ping}\`ms`)
            .setColor("ORANGE");
        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}

export default new Ping();
