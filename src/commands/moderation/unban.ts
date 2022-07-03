import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
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
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        const userId = interaction.options.getString("user-id");

        if (!userId) return;

        try {
            interaction.guild?.members.unban(userId);
        } catch (error) {
            return interaction.reply(
                "I do not have the permissions to do that!"
            );
        }

        interaction.reply("The user has been succesfully unbanned");
    }
}

export default new Unban();
