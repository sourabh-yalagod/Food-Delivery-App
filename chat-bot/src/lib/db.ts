
import { config } from "dotenv";
import { Pool } from "pg"
// Initialize connection pool
config()
export const pool = new Pool({
    ssl: { rejectUnauthorized: false },
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on("connect", (client) => {
    client.query("SET search_path TO public");
});

pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
});