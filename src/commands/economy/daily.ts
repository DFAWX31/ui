import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
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
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        const userId = interaction.user.id;

        const userDetails = await CheckIfExists(userId);

        if (!userDetails) {
            return interaction.reply({
                content: "Please use `join` before trying to do this",
                ephemeral: true,
            });
        }

        const addedValue = 250 + Math.floor(Math.random() * 250);

        await UpdateBalance(userId, addedValue);

        interaction.reply(
            `Congrates You've earned ${addedValue} to make your grand balance ${
                userDetails.balance + addedValue
            }`
        );
    }
}

export default new Daily();
