import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

import { commandFiles } from "../files";
import { Bot, BotCommand } from "../structures";
import { TypedEvent } from "../types";

export default TypedEvent({
    eventName: "ready",
    once: true,
    run: async (client: Bot) => {
        console.log(`Logged in as ${client.user?.tag}`);

        const commandArr: BotCommand[] = [];

        let tasks: Promise<unknown>[] = [];
        for (let i = 0; i < commandFiles.length; i += 1) {
            const file = commandFiles[i];
            const task = import(file);
            task.then((module) => {
                const command = module.default as BotCommand;
                if (command === undefined) {
                    console.error(`File at path ${file} seems to incorrect`);
                } else {
                    commandArr.push(command);
                }
            });
            tasks.push(task);
        }

        await Promise.all(tasks);

        for (let i = 0; i < commandArr.length; i += 1) {
            const command = commandArr[i];
            client.commands.set(command.data.name, command);
            console.log(`registered ${command.data.name}`);
        }

        const payload = commandArr.map((cmd) => cmd.data);

        tasks = [];

        const rest = new REST({ version: "9" }).setToken(
            process.env.TOKEN || ""
        );

        const guild = process.env.guildId || "";

        await rest.put(Routes.applicationGuildCommands(client.user.id, guild), {
            body: payload,
        });
        console.log("Succesfully registered slash commands!");
    },
});
