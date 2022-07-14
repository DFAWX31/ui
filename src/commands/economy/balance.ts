import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { CheckIfExists } from "../../database";
import { BotCommand } from "../../structures";

class Balance extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("balance")
                .setDescription("View your current balance")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription(
                            "The user you want to view the balance of"
                        )
                )
                .toJSON(),
            {
                timeout: 5000,
            }
        );
    }

    public async execute(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        if (interaction.user.bot) return;

        const user = interaction.options.getUser("user");

        if (!user) {
            const userInfo = await CheckIfExists(interaction.user.id);

            if (!userInfo) {
                return interaction.reply({
                    content: "please use `join` before doing this",
                    ephemeral: true,
                });
            }

            interaction.reply(`Your current balance is ${userInfo?.balance}`);
        } else {
            const userInfo = await CheckIfExists(user.id);

            if (!userInfo) {
                return interaction.reply({
                    content: `${user.tag} not found in database, please ask them to join the game using \`join\``,
                    ephemeral: true,
                });
            }

            interaction.reply(
                `The user's current balance is ${userInfo.balance}`
            );
        }
    }
}

export default new Balance();
