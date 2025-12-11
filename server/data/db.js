import { MongoClient } from "mongodb"
import dotenv from 'dotenv'
dotenv.config();

const url = process.env.DB_URL;
const client = new MongoClient(url);

// ставим флаг для подключения к базе данныъх (чтобы не подключаться каждый раз и возваращать уже подключенную базу)
let db = null;

export default async function runDB() {
    if (db) return db;
    try {
        await client.connect();
        console.log('подключение к базе данных прошло успешно');
        db = client.db(process.env.DB_NAME);
        return db;
    } catch {
        console.log('ошибка подключения к базе данных');
    }
}