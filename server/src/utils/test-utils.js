import knex from 'knex';

//this is for for integration test. It create a instance of knextjs with a in memory database
export const dbMemory = knex({
    client: 'sqlite3',
    connection: {
        filename: ':memory:',
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 10,
    },
});

//this is for unit test of the services and controllers. With this, we create a new instance of knextjs with a in memory database
//It is not for integration test
export const dbMemoryConfig = {
    client: 'sqlite3',
    connection: {
        filename: ':memory:',
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 10,
    },
};
