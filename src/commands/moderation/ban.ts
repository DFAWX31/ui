import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
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
                .addIntegerOption((option) =>
                    option
                        .setName("days")
                        .setDescription(
                            "The number of days the user is to banned for"
                        )
                )
                .toJSON(),
            { timeout: 5000 }
        );
    }

    public async execute(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");
        const days = interaction.options.getInteger("days");

        if (!user) return;

        if (!reason) return;

        const member = interaction.guild?.members.cache.get(user.id);

        if (!member) return;

        try {
            if (!days) {
                member?.ban({
                    reason: reason,
                });
            } else {
                member?.ban({
                    reason: reason,
                    days: days,
                });
            }
        } catch (error) {
            return interaction.reply(
                "I do not have the permissions to do this!"
            );
        }

        return interaction.reply(
            `${user} was succesfully banned from the server`
        );
    }
}

export default new Ban();
