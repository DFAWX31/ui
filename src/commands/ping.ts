import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CacheType,
    ChatInputCommandInteraction,
    EmbedBuilder,
} from "discord.js";
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
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<void> {
        const embed = new EmbedBuilder()
            .setTitle("Pong 🏓")
            .setDescription(`API Latency: \`${interaction.client.ws.ping}\`ms`)
            .setColor([255, 80, 0]);
        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}

export default new Ping();
