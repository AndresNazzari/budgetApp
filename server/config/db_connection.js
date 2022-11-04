import knex from 'knex';

export const configDb = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'budget',
        charset: 'utf8',
    },
};

export const db = knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'budget',
        charset: 'utf8',
    },
});

export const dbMemory = knex({
    client: 'sqlite3',
    connection: {
        filename: ':memory:',
    },
});
