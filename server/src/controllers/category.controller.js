import CategoryService from '../services/category.service.js';
import { validationResult } from 'express-validator';

export default class CategoryController {
    constructor({ categoryService }) {
        this.categoryService = categoryService;

        this.createCategory = this.createCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.getCategories = this.getCategories.bind(this);
    }

    async createCategory(req, res) {
        //check if errors in validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name } = req.body;

        try {
            //Add category to database
            await this.categoryService.addCategory(name);
            res.status(200).json({ msg: 'Category created' });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await this.categoryService.getCategories();
            res.status(200).json({ categories });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async removeCategory(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { category_id } = req.body;
        try {
            //check if category exists
            const queryResult = await this.categoryService.categoryExists(category_id);

            if (queryResult.length <= 0) {
                return res.status(400).json({ errors: [{ msg: "Category didn't exists" }] });
            }
            await this.categoryService.removeCategory(category_id);
            res.status(200).json({ msg: 'Category deleted' });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
}
