import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { BotCommand } from "../../structures";

class Rps extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("rps")
                .setDescription("Play a ✌fair✌ game of rock paper scissor")
                .addStringOption((option) =>
                    option
                        .setName("choice")
                        .setDescription("your choice")
                        .addChoices(
                            {
                                name: "🥌rock",
                                value: "rock",
                            },
                            {
                                name: "📃paper",
                                value: "paper",
                            },
                            {
                                name: "✂scissors",
                                value: "scissors",
                            }
                        )
                        .setRequired(true)
                )
                .toJSON(),
            {
                timeout: 10000,
            }
        );
    }
    public async execute(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        if (interaction.user.bot) return;

        const choice = interaction.options.getString("choice");

        if (!choice) return;

        const plays = ["rock", "paper", "scissors"];

        const res = Math.floor(Math.random() * plays.length);

        const botChoice = plays[res != plays.length ? res : res - 1];

        await interaction.reply({
            content: `The bot chose ${botChoice}`,
            ephemeral: true,
        });

        if (plays.indexOf(choice) == (res + 1) % plays.length) {
            interaction.followUp({
                content: "You won 🏳",
            });
        } else if (plays.indexOf(choice) == res) {
            interaction.followUp({
                content: "It's a draw🤝",
            });
        } else {
            interaction.followUp({
                content: "I won ✌",
            });
        }
    }
}

export default new Rps();
