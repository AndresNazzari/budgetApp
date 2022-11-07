export default class CategoryService {
    constructor({ db }) {
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
}
