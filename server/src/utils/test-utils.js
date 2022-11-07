import knex from 'knex';

export const dbMemory = knex({
    client: 'sqlite3',
    connection: {
        filename: ':memory:', //'./mydb.sqlite'
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        idleTimeoutMillis: 100,
        // max: 1,
        // disposeTimeout: (1000 * 60 * 1) / 4, //(1 minute)
    },
});

export const createDb = async (db) => {
    try {
        let hasTable = await db.schema.hasTable('categories');
        if (!hasTable) {
            await db.schema.createTable('categories', (table) => {
                table.increments('category_id');
                table.string('name');
                table.string('created_at');
            });
            const categories = [
                { name: 'Work', created_at: new Date() },
                { name: 'Dinner', created_at: new Date() },
                { name: 'Investments', created_at: new Date() },
                { name: 'Gifts', created_at: new Date() },
                { name: 'Transportation', created_at: new Date() },
                { name: 'Medical & Healthcare', created_at: new Date() },
                { name: 'Personal Spending', created_at: new Date() },
                { name: 'Saving', created_at: new Date() },
            ];
            await db('categories').insert(categories);
        }
        hasTable = await db.schema.hasTable('users');
        if (!hasTable) {
            await db.schema.createTable('users', (table) => {
                table.increments('user_id');
                table.string('name');
                table.string('email').unique();
                table.string('avatar');
                table.string('password');
                table.string('created_at');
            });
        }
        hasTable = await db.schema.hasTable('income');
        if (!hasTable) {
            await db.schema.createTable('income', (table) => {
                table.increments('income_id');
                table.string('concept');
                table.string('amount');
                table.string('date');
                table
                    .integer('category_id', 10)
                    .notNullable()
                    .unsigned()
                    .references('category_id')
                    .inTable('categories');
                table
                    .integer('user_id', 10)
                    .notNullable()
                    .unsigned()
                    .references('user_id')
                    .inTable('users');
            });
        }
        hasTable = await db.schema.hasTable('expense');
        if (!hasTable) {
            await db.schema.createTable('expense', (table) => {
                table.increments('expense_id');
                table.string('concept');
                table.string('amount');
                table.string('date');
                table
                    .integer('category_id', 10)
                    .notNullable()
                    .unsigned()
                    .references('category_id')
                    .inTable('categories');
                table
                    .integer('user_id', 10)
                    .notNullable()
                    .unsigned()
                    .references('user_id')
                    .inTable('users');
            });
        }
    } catch (error) {
        console.log(error);
    }
};
