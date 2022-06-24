import express from 'express';
import CategoryController from '../../controllers/category.controller.js';
import { check } from 'express-validator';
import auth from '../../middleware/auth.middleware.js';

export class CategoryRoute extends express.Router {
    constructor() {
        super();
        this.categoryController = new CategoryController();

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

        //@route    DELETE api/category
        //@desc     Create category
        //@access   Private
        /* this.delete(
            '/',
            auth,
            [check('name', 'Name is Required').not().isEmpty()],
            this.categoryController.removeCategory
        ); */
    }
}
