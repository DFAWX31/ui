import { getClient } from ".";

export async function CheckBalance(
    userId: string,
    amount: number
): Promise<boolean> {
    const client = getClient();

    if (!client) return false;

    const userBalanceDataSet = await client.money.findFirst({
        where: {
            userId: userId,
        },
    });

    if (!userBalanceDataSet) return false;

    if (userBalanceDataSet.balance < amount) {
        return false;
    } else {
        return true;
    }
}
