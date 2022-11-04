import { db } from '../config/db_connection.js';

export default class CategoryService {
    constructor() {
        this.knex = db;
    }

    async categoryExists(categoryId) {
        return await this.knex.select('*').from('categories').where('category_id', categoryId);
    }

    async addCategory(categoryName) {
        return await this.knex('categories').insert({
            name: categoryName,
            created_at: new Date(),
        });
    }

    async getCategories() {
        return await this.knex('categories').select('*');
    }
    async removeCategory(categoryId) {
        /*  const result = await this.knex
            .from('categories')
            .leftJoin('income', 'categories.category_id', 'income.category_id')
            .where('categories.category_id', categoryId);

        const result2 = await this.knex
            .from('categories')
            .leftJoin(
                'expense',
                'categories.category_id',
                'expense.category_id'
            )
            .where('categories.category_id', categoryId);

        console.log(result);
        console.log(result2);
        */
    }
}
