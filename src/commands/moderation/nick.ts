import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { BotCommand } from "../../structures";

class Nick extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("nick")
                .setDescription("Change the bot's nickname")
                .addStringOption((option) =>
                    option
                        .setName("nickname")
                        .setDescription("The new nickname for the bot")
                )
                .setDefaultMemberPermissions(134217728)
                .toJSON(),
            { timeout: 5000 }
        );
    }
    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<void> {
        const newNick = interaction.options.getString("nickname");

        try {
            const botUser = interaction.client.user;

            if (!botUser) return;

            const botMember = interaction.guild?.members.cache.get(botUser.id);

            if (!botMember) return;

            botMember.setNickname(newNick);
        } catch (error) {
            await interaction.reply(
                "I do not have the permissions to do that!"
            );
            return;
        }

        await interaction.reply("Succesfully changed my nickname");
    }
}

export default new Nick();
