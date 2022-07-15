import { CommandInteraction, MessageEmbed } from "discord.js";
import { CheckBalance, CheckIfExists, UpdateBalance } from "../../../database";

class Slots {
    public async slots(interaction: CommandInteraction) {
        if (interaction.user.bot) return;

        await interaction.deferReply({
            ephemeral: true
        });

        const amount = interaction.options.getInteger("amount");

        if (!amount) return;

        if (amount <= 0) return;

        if (!(await CheckBalance(interaction.user.id, amount))) {
            return interaction.editReply({
                content: "insufficient balance"
            });
        }

        const userInTable = await CheckIfExists(interaction.user.id);

        if (!userInTable) {
            return interaction.editReply({
                content: "Please use `join` before doing this"
            });
        }

        if (interaction.options.getSubcommand() != "slots") return;

        const firstSlot = ["🍒", "🌸", "7️⃣", "⭐", "🎀", "💎"];
        const secondSlot = ["🌸", "🎀", "7️⃣", "🍒", "🎀", "💎"];
        const thirdSlot = ["💎", "🎀", "⭐", "7️⃣", "🌸", "🍒"];

        const firstInt = Math.floor(Math.random() * 5);
        const oneRow = [
            firstSlot[firstInt],
            firstSlot[(firstInt + 1) % 6],
            firstSlot[(firstInt + 2) % 6],
        ];
        const secondInt = Math.floor(Math.random() * 5);
        const twoRow = [
            secondSlot[secondInt],
            secondSlot[(secondInt + 1) % 6],
            secondSlot[(secondInt + 2) % 6],
        ];
        const thirdInt = Math.floor(Math.random() * 5);
        const threeRow = [
            thirdSlot[thirdInt],
            thirdSlot[(thirdInt + 1) % 6],
            thirdSlot[(thirdInt + 2) % 6],
        ];

        let win = 0;

        if (oneRow[1] == twoRow[1] && oneRow[1] == threeRow[1]) {
            win += amount * 100;
        } else if (
            (oneRow[0] == twoRow[0] && oneRow[0] == threeRow[0]) ||
            (oneRow[2] == twoRow[2] && oneRow[2] == threeRow[2])
        ) {
            win += amount * 50;
        } else if (
            (oneRow[0] == twoRow[1] && oneRow[0] == threeRow[2]) ||
            (oneRow[2] == twoRow[1] && oneRow[2] == threeRow[0])
        ) {
            win += amount * 25;
        } else {
            win -= amount;
        }

        let embed = new MessageEmbed()
            .setTitle("slot results")
            .addFields(
                {
                    name: "First row...",
                    value: `${oneRow[0]}`,
                    inline: false,
                },
                {
                    name: "Second row...",
                    value: `${oneRow[1]}`,
                    inline: false,
                },
                {
                    name: "Third row...",
                    value: `${oneRow[2]}`,
                    inline: false,
                }
            )
            .setColor("RED");

        await interaction.editReply({
            embeds: [embed]
        });

        embed = new MessageEmbed()
            .setTitle("slot results")
            .addFields(
                {
                    name: "First row...",
                    value: `${oneRow[0]}\t${twoRow[0]}`,
                    inline: false,
                },
                {
                    name: "Second row...",
                    value: `${oneRow[1]}\t${twoRow[1]}\t`,
                    inline: false,
                },
                {
                    name: "Third row...",
                    value: `${oneRow[2]}\t${twoRow[2]}\t`,
                    inline: false,
                }
            )
            .setColor("YELLOW");

        await interaction.editReply({
            embeds: [embed]
        });

        embed = new MessageEmbed()
            .setTitle("slot results")
            .addFields(
                {
                    name: "First row...",
                    value: `${oneRow[0]}\t${twoRow[0]}\t${threeRow[0]}`,
                    inline: false,
                },
                {
                    name: "Second row...",
                    value: `${oneRow[1]}\t${twoRow[1]}\t${threeRow[1]}`,
                    inline: false,
                },
                {
                    name: "Third row...",
                    value: `${oneRow[2]}\t${twoRow[2]}\t${threeRow[2]}`,
                    inline: false,
                }
            )
            .setColor("AQUA");

        interaction.editReply({
            embeds: [embed],
        });

        await UpdateBalance(interaction.user.id, win);

        if (win < 0) {
            return interaction.channel?.send(
                "unfortunately you've lost this round"
            );
        } else {
            return interaction.channel?.send(
                `Congratulations!! ${interaction.user
                }, you've won ${win} for a grand balance of ${userInTable.balance + win
                }`
            );
        }
    }
}

export default new Slots();
