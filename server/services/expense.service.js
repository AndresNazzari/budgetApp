import { db } from '../config/db_connection.js';

export default class ExpenseService {
    constructor() {
        this.knex = db;
    }

    async addExpense(concept, amount, date, category_id, user_id) {
        const expense_id = await this.knex('expense').insert({
            concept,
            amount,
            date,
            category_id,
            user_id,
        });
        return { expense_id: expense_id[0], concept, amount, date, category_id, user_id };
    }

    async getExpenses(user_id) {
        return await this.knex('expense').select('*').where({ user_id });
    }

    async updateExpense(expense_id, concept, amount, date, category_id) {
        return await this.knex('expense')
            .update({
                concept,
                amount,
                date,
                category_id,
            })
            .where({ expense_id });
    }
    async removeExpense(expense_id) {
        return await this.knex('expense').where({ expense_id }).del();
    }
}
