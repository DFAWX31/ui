import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { BaseInteraction, PermissionResolvable } from "discord.js";
import Bot from "./Bot";

export type BotCommandOpt = {
    requiredPerms?: PermissionResolvable;
    timeout?: number;
};

export default abstract class BotCommand {
    public readonly data: RESTPostAPIApplicationCommandsJSONBody;

    public readonly timeout?: number;

    public readonly requirePerms?: PermissionResolvable;

    protected constructor(
        data: RESTPostAPIApplicationCommandsJSONBody,
        opt?: BotCommandOpt
    ) {
        this.data = data;
        this.timeout = opt?.timeout;
        this.requirePerms = opt?.requiredPerms;
    }

    public abstract execute(
        interaction: BaseInteraction,
        client: Bot
    ): Promise<void>;
}
