import { Client, Collection, Intents } from "discord.js";
import { eventFiles } from "../files";
import { IBotEvent } from "../types";

import BotCommand from "./BotCommand";

export default class Bot extends Client<true> {
	protected static instance: Bot;

	public commands = new Collection<string, BotCommand>();

	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS
			],
			partials: ["MESSAGE", "CHANNEL", "REACTION"],
		});
		Bot.instance = this;
	}

	static getInstance(): Bot {
		return Bot.instance;
	}

	async start() {
		await this.initModules();
		await this.login(process.env.TOKEN || "");
	}

	async initModules() {
		const tasks: Promise<unknown>[] = [];
		for (let i = 0; i < eventFiles.length; i += 1) {
			const file = eventFiles[i];
			const task = import(file);
			task.then((module) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const event = module.default as IBotEvent<any>;

				if (!event) {
					console.error(
						`File at path ${file} seems to incorrectly be exporting an event.`
					);
				} else {
					if (event.once) {
						this.once(event.eventName, event.run.bind(null, this));
					} else {
						this.on(event.eventName, event.run.bind(null, this));
					}
				}
				tasks.push(task);
			});
		}
		await Promise.all(tasks);
	}
}