import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

config({ path: ".env" }); // or .env.local


const connection = postgres({
	host: process.env.POSTGRES_DB_HOST,
	port: Number(process.env.POSTGRES_DB_PORT),
	user: process.env.POSTGRES_DB_USER,
	password: process.env.POSTGRES_DB_PASSWORD,
	database: process.env.POSTGRES_DB_NAME,
	max: process.env.POSTGRES_MAX_CONNECTIONS ? Number(process.env.POSTGRES_MAX_CONNECTIONS) : 1
});

const drizzleClient = drizzle(connection, {
	logger: true,
	schema
});


export { drizzleClient };