import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction, Message } from "discord.js";
import { BotCommand } from "../../structures";

class Roulette extends BotCommand {
	constructor() {
		super(
			new SlashCommandBuilder()
				.setName("roulette")
				.setDescription("Start a new russian roulette game")
				.addIntegerOption(option => option.setName("time").setDescription("The amount of time the game would accept members 10s-30s"))
				.toJSON(),
			{
				timeout: 35000
			}
		);
	}

	public async execute(
		interaction: CommandInteraction<CacheType>
	): Promise<void> {

		await interaction.deferReply();

		let time = interaction.options.getInteger("time");

		time = time ? time < 30 && time > 10 ? time * 1000 : 15000 : 15000;

		const members = [interaction.user.id];

		const filter = (message: Message) => {
			return message.content.includes("join") && message.channel.id === interaction.channel?.id;
		};

		const collector = interaction.channel?.createMessageCollector({ filter: filter, time: time });

		if (!collector) return;

		collector?.on("collect", (message: Message) => {
			if (!(message.author.id in members)) {
				members.push(message.author.id);
			}
		});

		collector.on("end", async () => {
			const selected = Math.floor(Math.random() * members.length);
			const loser = await interaction.guild?.members.fetch(members[selected]);

			if (!loser) return;

			interaction.editReply({
				content: `${loser} died`
			});
		});
	}
}

export default new Roulette();