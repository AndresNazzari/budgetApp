import knex from 'knex';
import { configDb } from './db_connection.js';

export const createDatabase = async () => {
    const db = knex(configDb);
    const databaseName = process.env.DB_NAME || 'budget';

    try {
        // await db.raw(`DROP DATABASE ${databaseName}`);
        // console.log(`🗃️ Database Dropped: ${databaseName}`);
        await db.raw(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
        console.log(`🗃️ Database Created: ${databaseName}`);
    } catch (error) {
        console.log(error);
    } finally {
        await db.destroy();
    }
};
