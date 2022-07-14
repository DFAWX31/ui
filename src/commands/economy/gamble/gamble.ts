import { CacheType, CommandInteraction } from "discord.js";
import { BotCommand } from "../../../structures";
import { SlashCommandBuilder } from "@discordjs/builders";
import subSlots from "./subSlots";
import subdice from "./subDice";

class Gamble extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("gamble")
                .setDescription("gamble money")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("dice")
                        .setDescription("Roll a dice")
                        .addIntegerOption((option) =>
                            option
                                .setName("amount")
                                .setDescription("The amount being gambled")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("slots")
                        .setDescription("Use the slots")
                        .addIntegerOption((option) =>
                            option
                                .setName("amount")
                                .setDescription("the amount being gambled")
                                .setRequired(true)
                        )
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
        if (interaction.options.getSubcommand() == "dice") {
            await subdice.dice(interaction);
        } else if (interaction.options.getSubcommand() == "slots") {
            await subSlots.slots(interaction);
        } else return;
    }
}

export default new Gamble();
