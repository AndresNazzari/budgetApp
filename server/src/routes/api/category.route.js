import express from 'express';
import { check } from 'express-validator';
import auth from '../../middleware/auth.middleware.js';
export default class CategoryRoute extends express.Router {
    constructor({ categoryController }) {
        super();
        this.categoryController = categoryController;

        //@route    POST api/category
        //@desc     Create category
        //@access   Private
        this.post(
            '/',
            auth,
            [check('name', 'Name is Required').not().isEmpty()],
            this.categoryController.createCategory
        );

        //@route    GET api/category
        //@desc     Get all categories
        //@access   Private
        this.get('/', auth, this.categoryController.getCategories);
    }
}
