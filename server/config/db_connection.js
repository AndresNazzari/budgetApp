export const configDb = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.PASSWORD,
        charset: 'utf8',
    },
};
