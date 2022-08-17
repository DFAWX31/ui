import {
    ChatInputCommandInteraction,
    ActionRowBuilder,
    SelectMenuBuilder,
    SelectMenuInteraction,
    MessageComponentInteraction,
    ComponentType,
} from "discord.js";
import { CheckBalance, CheckIfExists, UpdateBalance } from "../../../database";

class Dice {
    public async dice(interaction: ChatInputCommandInteraction): Promise<void> {
        if (interaction.user.bot) return;

        await interaction.deferReply({
            ephemeral: true,
        });

        const amount = interaction.options.getInteger("amount");

        if (!amount) return;

        if (amount <= 0) return;

        if (!(await CheckBalance(interaction.user.id, amount))) {
            await interaction.editReply({
                content: "Insufficient balance",
            });
            return;
        }

        const userInTable = await CheckIfExists(interaction.user.id);

        if (!userInTable) {
            await interaction.editReply({
                content: "Please use `join` before doing this",
            });
            return;
        }

        if (interaction.options.getSubcommand() != "dice") return;

        const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents([
            new SelectMenuBuilder()
                .setCustomId("dice")
                .setMinValues(1)
                .setMaxValues(5)
                .addOptions([
                    {
                        label: "Six",
                        description: "6️⃣",
                        value: "six",
                    },
                    {
                        label: "Five",
                        description: "5️⃣",
                        value: "five",
                    },
                    {
                        label: "Four",
                        description: "4️⃣",
                        value: "four",
                    },
                    {
                        label: "Three",
                        description: "3️⃣",
                        value: "three",
                    },
                    {
                        label: "Two",
                        description: "2️⃣",
                        value: "two",
                    },
                    {
                        label: "One",
                        description: "1️⃣",
                        value: "one",
                    },
                ]),
        ]);

        const message = await interaction.channel?.send({
            content: "Make your selection",
            components: [row],
        });

        const filter = (i: MessageComponentInteraction) => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        if (!message) return;

        message
            .awaitMessageComponent({
                filter: filter,
                componentType: ComponentType.SelectMenu,
                time: 30000,
            })
            .then(async (select: SelectMenuInteraction) => {
                const diceResult = 1 + Math.floor(Math.random() * 5);

                interaction.editReply({
                    content: `The dice rolled a ${diceResult}`,
                });

                let win = 0;

                const selectedOptions: number[] = [];

                select.values.forEach((selectedValues) => {
                    switch (selectedValues) {
                        case "one":
                            selectedOptions.push(1);
                            break;
                        case "two":
                            selectedOptions.push(2);
                            break;
                        case "three":
                            selectedOptions.push(3);
                            break;
                        case "four":
                            selectedOptions.push(4);
                            break;
                        case "five":
                            selectedOptions.push(5);
                            break;
                        case "six":
                            selectedOptions.push(6);
                            break;
                    }
                });

                if (diceResult in selectedOptions) {
                    win += Math.floor(amount * (5.5 - selectedOptions.length));
                }

                await UpdateBalance(interaction.user.id, win);

                if (win <= 0) {
                    message.edit({
                        content: `${interaction.user
                            } lost ${amount} coins😖, balance is ${userInTable.balance - amount
                            }`,
                        components: [],
                    });
                } else {
                    message.edit({
                        content: `You've won ${win} coins, ${interaction.user
                            }, your new balance is ${userInTable.balance + win}`,
                        components: [],
                    });
                }
            });
    }
}

export default new Dice();
