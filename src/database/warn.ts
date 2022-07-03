import { getClient } from ".";

export async function warnUser(
    userId: string,
    guildId: string,
    reason: string
): Promise<void> {
    const client = getClient();

    const warnedUser = await client.members.findFirst({
        where: {
            guildId: guildId,
            userId: userId,
        },
    });

    let numberOfWarns: number;

    if (warnedUser) {
        numberOfWarns = warnedUser.numberOfWarns + 1;
    } else {
        numberOfWarns = 1;
    }

    await client.members.upsert({
        where: {
            // eslint-disable-next-line camelcase
            guildId_userId: {
                guildId: guildId,
                userId: userId,
            },
        },
        update: {
            numberOfWarns: numberOfWarns,
        },
        create: {
            guildId: guildId,
            userId: userId,
            numberOfWarns: numberOfWarns,
        },
    });

    await client.warns.create({
        data: {
            member: userId,
            reason: reason,
            guildId: guildId,
        },
    });
}
