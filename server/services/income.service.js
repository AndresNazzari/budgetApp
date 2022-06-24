import knex from 'knex';
import { configDb } from '../config/db_connection.js';

export default class UserService {
    constructor() {
        this.knex = knex(configDb);
    }

    async addIncome(concept, amount, date, category_id, user_id) {
        const income_id = await this.knex('income').insert({
            concept,
            amount,
            date,
            category_id,
            user_id,
        });
        return { income_id: income_id[0], concept, amount, date, category_id, user_id };
    }

    async getIncomes(user_id) {
        return await this.knex('income').select('*').where({ user_id });
    }

    async updateIncome(income_id, concept, amount, date, category_id) {
        return await this.knex('income')
            .update({
                concept,
                amount,
                date,
                category_id,
            })
            .where({ income_id });
    }
    async removeIncome(income_id) {
        return await this.knex('income').where({ income_id }).del();
    }
}
