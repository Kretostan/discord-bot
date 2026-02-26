import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { schemaSql } from "./schema";

const DB_DIR = path.join(process.cwd(), "db");
const DB_PATH = path.join(DB_DIR, "bot.db");

if (!fs.existsSync(DB_DIR)) {
	fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

db.exec(schemaSql);

export default db;
