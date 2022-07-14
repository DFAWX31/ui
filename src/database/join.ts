import { Money } from "@prisma/client";
import { getClient } from ".";

export async function CheckIfExists(userId: string): Promise<Money | null> {
    const client = getClient();

    if (!client) return null;

    const user = await client.money.findFirst({
        where: {
            userId: userId,
        },
    });

    return user;
}

export async function AddToTable(userId: string): Promise<void> {
    const client = getClient();

    if (!client) return;

    await client.money.create({
        data: {
            userId: userId,
            balance: 0,
        },
    });
}

export async function UpdateBalance(
    userId: string,
    money: number
): Promise<void> {
    const client = getClient();

    if (!client) return;

    await client.money.update({
        where: {
            userId: userId,
        },
        data: {
            balance: {
                increment: money,
            },
        },
    });
}
