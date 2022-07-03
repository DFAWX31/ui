import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { BotCommand } from "../../structures";

class Kick extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("kick")
                .setDescription("Kick a user from the server")
                .setDefaultMemberPermissions(2)
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user to be kicked")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("reason")
                        .setDescription("The reason the user is getting kicked")
                        .setRequired(true)
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

        if (!user) return;

        if (!reason) return;

        const member = interaction.guild?.members.cache.get(user.id);

        if (!member) return;

        try {
            member?.kick(reason);
        } catch (error) {
            return interaction.reply(
                "I do not have the permissions to do this!"
            );
        }

        return interaction.reply(
            `${user} was succesfully kicked from the server`
        );
    }
}

export default new Kick();
