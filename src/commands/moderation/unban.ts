import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { BotCommand } from "../../structures";

class Unban extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("unban")
                .setDescription("Unban a banned user from the server")
                .setDefaultMemberPermissions(4)
                .addStringOption((option) =>
                    option
                        .setName("user-id")
                        .setDescription(
                            "The userId of the banned user to be unbanned"
                        )
                        .setRequired(true)
                )
                .toJSON(),
            { timeout: 5000 }
        );
    }

    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<void> {
        const userId = interaction.options.getString("user-id");

        if (!userId) return;

        try {
            await interaction.guild?.members.unban(userId);
        } catch (error) {
            await interaction.reply(
                "I do not have the permissions to do that!"
            );
            return;
        }

        await interaction.reply("The user has been succesfully unbanned");
    }
}

export default new Unban();
