import express, { response } from "express";
import cors from "cors";
import { run, user } from "@openai/agents";
import { config } from "dotenv";
import { appendChatMessage, ChatMessage, getChatContext } from "./utils/redis.js";
import { mainAgent } from "./agent/mainAgent.js";
config()
const app = express();
app.use(express.json());


const urls: string = process.env.CORS || "";
app.use(cors({ origin: urls.split(",") }))
const port = process.env.PORT || 3000;
app.get('/api/health', (req, res) => {
    return res.json({ status: "Chat Api is Active" })
})

app.post("/api/chat", async (req, res) => {
    let userId = req.body?.userId;
    const { query } = req.body;
    const input: any = { userId, history: [], query }
    if (!userId) {
        userId = req.ip;
    }

    const history = await getChatContext(userId);
    console.log({ history })
    let len = history.length;
    input.history = history.slice(len - 8, len - 1);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders?.();
    res.write("");

    const stream: any = await run(mainAgent, JSON.stringify(input), { stream: true });

    let response = "";
    try {
        for await (const event of stream) {
            if (
                event.type === "raw_model_stream_event" &&
                event.data?.type === "output_text_delta"
            ) {
                response += event?.data?.delta || ""
                res.write(event.data.delta);
            }
        }
    } catch (err) {
        console.error(err);
        res.write("\n[Error generating response]");
    } finally {
        const chat: ChatMessage = { content: response, timestamp: new Date().getTime(), role: "assistant" }
        appendChatMessage(userId, chat).then()
        res.end();
    }
});




app.listen(port, () => {
    console.log("http://localhost:3000");
})

export default app;