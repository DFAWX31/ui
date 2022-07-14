import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export function getClient(): PrismaClient {
    return client;
}

export const connectToDatabase = () => client.$connect;

export * from "./warns";
export * from "./warn";
export * from "./join";
export * from "./money";
