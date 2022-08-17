import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { AddToTable, CheckIfExists } from "../../database";

import { BotCommand } from "../../structures";

class Join extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("join")
                .setDescription("join the economy game")
                .toJSON(),
            {
                timeout: 5000,
            }
        );
    }

    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<void> {
        const userId = interaction.user.id;

        const userExists = await CheckIfExists(userId);

        if (!userExists) {
            await AddToTable(userId);
        } else {
            await interaction.reply({
                content: "You have already joined the economy game!!",
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({
            content: `You have succesfully joined the economy game ${interaction.user}`,
            ephemeral: true,
        });
    }
}

export default new Join();
