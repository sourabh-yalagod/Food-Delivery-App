import { pool } from "@/lib/db.js";
import { tool } from "@openai/agents";
import z from "zod";

export const executeSQLTool = tool({
    name: "executeSQLTool",
    description: "Executes a query on the database",
    parameters: z.object({
        sql: z.string().describe("sql query"),
    }),

    async execute({ sql }) {
        try {
            console.log("Executing SQL:", sql);
            const response = await pool.query(sql);
            return response.rows;
        } catch (error) {
            console.log("ERROR : ", error)
        }
    },
});

