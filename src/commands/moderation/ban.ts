import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { BotCommand } from "../../structures";

class Ban extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("ban")
                .setDescription("Ban a user from the server")
                .setDefaultMemberPermissions(4)
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user to be banned")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("reason")
                        .setDescription("The reason the user is getting banned")
                        .setRequired(true)
                )
                .toJSON(),
            { timeout: 5000 }
        );
    }

    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<void> {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        if (!user) return;

        if (!reason) return;

        const member = interaction.guild?.members.cache.get(user.id);

        if (!member) return;

        try {
            member?.ban({
                reason: reason,
            });
        } catch (error) {
            await interaction.reply(
                "I do not have the permissions to do this!"
            );
            return;
        }

        await interaction.reply(
            `${user} was succesfully banned from the server`
        );
        return;
    }
}

export default new Ban();
