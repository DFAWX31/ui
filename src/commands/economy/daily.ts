import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { CheckIfExists, UpdateBalance } from "../../database";
import { BotCommand } from "../../structures";

class Daily extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("daily")
                .setDescription("claim the daily reward")
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

        const userDetails = await CheckIfExists(userId);

        if (!userDetails) {
            await interaction.reply({
                content: "Please use `join` before trying to do this",
                ephemeral: true,
            });
            return;
        }

        const addedValue = 250 + Math.floor(Math.random() * 250);

        await UpdateBalance(userId, addedValue);

        await interaction.reply(
            `Congrats You've earned ${addedValue} to make your grand balance ${userDetails.balance + addedValue
            }`
        );
    }
}

export default new Daily();
