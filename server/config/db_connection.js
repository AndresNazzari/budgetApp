export const configDb = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        charset: 'utf8',
    },
};
