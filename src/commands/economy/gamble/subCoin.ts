import { CommandInteraction } from "discord.js";
import { UpdateBalance } from "../../../database";

class Coin {
	public async coin(interaction: CommandInteraction) {
		if (interaction.user.bot) return;

		await interaction.deferReply({
			ephemeral: true
		});

		const selection = interaction.options.getString("selection");
		const amount = interaction.options.getInteger("amount");

		if (!selection || !amount) return;

		if (amount <= 0) return;

		const res = Math.floor(Math.random() * 2);

		const options = ["head", "tail"];

		interaction.editReply({
			content: `The coin landed on ${options[res]}`
		});

		let win = -amount;

		if (selection == options[res]) {
			win += Math.floor(amount * 1.5);
		}

		await UpdateBalance(interaction.user.id, win);

		if (win < 0) {
			return interaction.followUp(`You've lost ${amount} coins`);
		}

		interaction.followUp(`You've won ${win - amount} coins`);
	}
}

export default new Coin();