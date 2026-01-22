import { Redis } from "@upstash/redis";
import { config } from "dotenv";
config()

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CHAT_TTL = 60 * 5; // 5 minutes

export type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: number;
};

const getChatKey = (chatId: string) => `chat:context:${chatId}`;

export async function setChatContext(
    chatId: string,
    messages: ChatMessage[]
) {
    const key = getChatKey(chatId);

    await redis.set(key, messages, {
        ex: CHAT_TTL,
    });
}

export async function getChatContext(
    chatId: string
): Promise<ChatMessage[]> {
    const key = getChatKey(chatId);

    const data = await redis.get<ChatMessage[]>(key);
    return data ?? [];
}

export async function appendChatMessage(
    chatId: string,
    message: ChatMessage
) {
    const key = getChatKey(chatId);

    const existing = (await redis.get<ChatMessage[]>(key)) ?? [];

    const updated = [...existing, message];

    await redis.set(key, updated, {
        ex: CHAT_TTL, // refresh TTL on every message
    });
}

export async function clearChatContext(chatId: string) {
    const key = getChatKey(chatId);
    await redis.del(key);
}
